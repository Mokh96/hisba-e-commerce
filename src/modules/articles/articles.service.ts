import { Injectable } from '@nestjs/common';
import { CreateArticleDto, CreateSyncArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto, UpdateSyncArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager, FindManyOptions, In, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { QueryArticleDto } from './dto/query-article.dto';
import { fromDtoToQuery } from 'src/helpers/function.global';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { UploadFileType } from 'src/modules/files/types/upload-file.type';
import { BulkResponse } from 'src/common/types/bulk-response.type';
import { getFilesBySyncId } from 'src/modules/files/utils/file-lookup.util';
import { getEntitiesByIds } from 'src/common/utils/entity.utils';

type TProduct = Pick<Product, 'id' | 'maxPrice' | 'minPrice'>;

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private uploadManager: UploadManager,
    private dataSource: DataSource,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ): Promise<Article> {
    let uploadedFiles: UploadFileType[] = [];

    return this.dataSource.manager.transaction(async (manager) => {
      try {
        // Step 1: Upload article image
        uploadedFiles = await this.uploadManager.uploadFiles(files);

        const product = await this.getProductById(createArticleDto.productId, manager);

        // Step 2: Create the article entity
        const article = this.articleRepository.create({
          ...createArticleDto,
          imgPath: uploadedFiles[0]?.path || null,
        });

        // Step 3: Update product price range if necessary
        await this.updateProductPricing(product, article.price, manager);

        // Step 4: Save the article and return it
        return await manager.save(article);
      } catch (error) {
        await this.uploadManager.cleanupFiles(uploadedFiles);
        throw error;
      }
    });
  }

  async createBulk(createSyncArticlesDto: CreateSyncArticleDto[], files: Express.Multer.File[]) {
    const response: BulkResponse = {
      //todo : Group products by their ID.
      successes: [],
      failures: [],
    };

    for (let i = 0; i < createSyncArticlesDto.length; i++) {
      const articleImage = getFilesBySyncId(files, FileUploadEnum.Image, createSyncArticlesDto[i].syncId);

      try {
        const article = await this.create(createSyncArticlesDto[i], { [FileUploadEnum.Image]: articleImage });
        response.successes.push(article);
        //response.successes.push({ id: article.id, syncId: article.syncId });
      } catch (error) {
        response.failures.push({
          index: i,
          syncId: createSyncArticlesDto[i].syncId,
          errors: error,
        });
      }
    }
    return response;
  }

  async findAll(queryArticleDto: QueryArticleDto) {
    const queryArticle = fromDtoToQuery(queryArticleDto);
    return await this.articleRepository.findBy(queryArticle);
  }

  async findOne(id: number) {
    return await this.articleRepository.findOneOrFail({
      where: { id },
      relations: {
        optionValues: {
          option: true,
        },
        product: true,
      },
    });
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ) {
    let article = await this.articleRepository.findOneByOrFail({ id });
    const initialImgPath = article.imgPath; // Get the initial image path

    const uploadedFiles = await this.uploadManager.uploadFiles(files); // Upload new image
    const newPath = uploadedFiles.length > 0 ? uploadedFiles[0].path : undefined;

    return this.dataSource.manager.transaction(async (manager) => {
      try {
        let updatedFields: DeepPartial<Article> = { ...updateArticleDto };

        if (newPath) {
          updatedFields.imgPath = newPath; // Update with new image
        }

        article = this.articleRepository.merge(article, updatedFields);
        await this.articleRepository.save(article);

        // remove the old image if new one is uploaded
        if (newPath && initialImgPath) {
          await this.uploadManager.removeFile(initialImgPath);
        }

        //update product price only when the article price is updated
        if (article.price !== updateArticleDto.price) {
          const product = await this.getProductById(article.productId, manager);
          await this.updateProductPricing(product, updateArticleDto.price, manager);
        }

        const updatedArticle = this.articleRepository.merge(article, updateArticleDto);
        await this.articleRepository.save(updatedArticle);
        return updatedArticle;
      } catch (error) {
        await this.uploadManager.cleanupFiles(uploadedFiles);
        throw error;
      }
    });
  }

  async updateBulk(updateSyncArticlesDto: UpdateSyncArticleDto[], files: Express.Multer.File[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (let i = 0; i < updateSyncArticlesDto.length; i++) {
      const articleImage = getFilesBySyncId(files, FileUploadEnum.Image, updateSyncArticlesDto[i].syncId);
      try {
        const article = await this.update(updateSyncArticlesDto[i].id, updateSyncArticlesDto[i], {
          [FileUploadEnum.Image]: articleImage,
        });
        response.successes.push(article);
        //response.successes.push({ id: article.id, syncId: article.syncId });
      } catch (error) {
        response.failures.push({
          index: i,
          syncId: updateSyncArticlesDto[i].syncId,
          errors: error,
        });
      }
    }

    return response;
  }

  private async getProductById(id: number, manager: EntityManager): Promise<TProduct> {
    return await manager.findOneOrFail(Product, {
      where: { id: id },
      select: { id: true, maxPrice: true, minPrice: true },
    });
  }

  private async updateProductPricing(product: TProduct, newPrice: number, manager: EntityManager) {
    const shouldUpdateMax = newPrice > product.maxPrice;
    const shouldUpdateMin = newPrice < product.minPrice || product.minPrice === null;

    if (shouldUpdateMax || shouldUpdateMin) {
      await manager.update(Product, product.id, {
        maxPrice: shouldUpdateMax ? newPrice : product.maxPrice,
        minPrice: shouldUpdateMin ? newPrice : product.minPrice,
      });
    }
  }

  public async getArticlesByIds(articleIds: Article['id'][], options: FindManyOptions<Article> = {}) {
    return await getEntitiesByIds(this.articleRepository, articleIds, options);
  }

  async remove(id: number) {
    const article = await this.articleRepository.findOneByOrFail({ id });
    await this.articleRepository.remove(article);
    return true;
  }
}
