import { Injectable } from '@nestjs/common';
import { CreateArticleDto, CreateSyncArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto, UpdateSyncArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager, FindManyOptions, In, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { UploadFileType } from 'src/modules/files/types/upload-file.type';
import { BulkResponseType } from 'src/common/types/bulk-response.type';
import { getFilesBySyncId } from 'src/modules/files/utils/file-lookup.util';
import { getEntitiesByIds } from 'src/common/utils/entity.utils';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { ArticleFilterDto } from './config/article-filter.dto';
import { QueryUtils } from 'src/common/utils/query-utils/query.utils';
import { formatCaughtException } from 'src/common/exceptions/helpers/format-caught-exception.helper';
import { createPaginationDto } from 'src/common/dtos/base/create-pagination/create-pagination.dto';

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

        // Step 3: Update the product price range if necessary
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
    const response: BulkResponseType = {
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
        const formattedError = formatCaughtException(error);

        response.failures.push({
          syncId: createSyncArticlesDto[i].syncId,
          error: formattedError,
        });
      }
    }
    return response;
  }

  async findAll(articleFilterDto: ArticleFilterDto): Promise<PaginatedResult<DeepPartial<Article>>> {
    const queryBuilder = this.articleRepository.createQueryBuilder(this.articleRepository.metadata.tableName);

    QueryUtils.use(queryBuilder)
      .applySearch(articleFilterDto.search)
      .applyFilters(articleFilterDto.filters)
      .applyGtFilters(articleFilterDto.gt)
      .applyLtFilters(articleFilterDto.lt)
      .applyGteFilters(articleFilterDto.gte)
      .applyLteFilters(articleFilterDto.lte)
      .applyInFilters(articleFilterDto.in)
      .applySelectFields(articleFilterDto.fields)
      .applyPagination2({
        sort: articleFilterDto.sort,
        offset: articleFilterDto.offset,
        limit: articleFilterDto.limit,
      });

    const [data, totalItems] = await queryBuilder.getManyAndCount();
    return { totalItems, data };
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

        // remove the old image if a new one is uploaded
        if (newPath && initialImgPath) {
          await this.uploadManager.removeFile(initialImgPath);
        }

        //update the product price only when the article price is updated
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
    const response: BulkResponseType = {
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
        const formattedError = formatCaughtException(error);

        response.failures.push({
          syncId: updateSyncArticlesDto[i].syncId,
          error: formattedError,
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
    await this.uploadManager.removeFile(article.imgPath);

    return true;
  }
}
