import {  Injectable } from '@nestjs/common';
import { CreateArticleDto, CreateSyncArticleDto } from './dto/create-article.dto';
import { UpdateSyncArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ProductsService } from 'src/modules/products/products.service';
import { QueryArticleDto } from './dto/query-article.dto';
import { fromDtoToQuery } from 'src/helpers/function.global';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { UploadFileType } from 'src/modules/files/types/upload-file.type';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
    private productsService: ProductsService,
    private uploadManager: UploadManager,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ): Promise<Article> {
    let uploadedFiles: UploadFileType[] = [];

    // Use a transaction to ensure data consistency
    return this.articleRepository.manager.transaction(async (manager) => {
      try {
        // Step 1: Upload article image
        uploadedFiles = await this.uploadManager.uploadFiles(files);

        const product = await manager.findOneOrFail(Product, {
          where: { id: createArticleDto.productId },
          select: { id: true, maxPrice: true, minPrice: true },
        });

        // Step 2: Create the article entity
        const article = this.articleRepository.create({
          ...createArticleDto,
          defaultImgPath: uploadedFiles[0]?.path || null,
        });

        // Step 3: Update product price range if necessary
        const price = createArticleDto.price;

        const shouldUpdateMax = price > product.maxPrice;
        const shouldUpdateMin = price < product.minPrice || product.minPrice === null;

        if (shouldUpdateMax || shouldUpdateMin) {
          await manager.update(Product, product.id, {
            maxPrice: shouldUpdateMax ? price : product.maxPrice,
            minPrice: shouldUpdateMin ? price : product.minPrice,
          });
        }

        // Step 4: Save the article and return it
        return await manager.save(article);
      } catch (error) {
        await this.uploadManager.cleanupFiles(uploadedFiles);
        throw error;
      }
    });
  }

  async createBulk(createSyncArticlesDto: CreateSyncArticleDto[]) {
    const articles = this.articleRepository.create(createSyncArticlesDto);

    const baseFailures: { syncId: number; error: unknown }[] = [];
    const success: Article[] = [];

    for (const article of articles) {
      try {
        const savedArticle = await this.saveArticle(article);
        success.push(savedArticle);
      } catch (error) {
        baseFailures.push({
          syncId: article.syncId,
          error,
        });
      }
    }

    return { success, baseFailures };
  }

  async findAll(queryArticleDto: QueryArticleDto) {
    const queryArticle = fromDtoToQuery(queryArticleDto);

    const articles = await this.articleRepository.findBy(queryArticle);
    return articles;
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOneOrFail({
      where: { id: id },
      relations: ['lots', 'gallery', 'optionValues'],
    });
    return article;
  }

  async update(id: number, updateArticleDto: UpdateSyncArticleDto) {
    let article = await this.findById(id);
    const updatedArticle = this.articleRepository.merge(article, updateArticleDto);

    await this.articleRepository.save(updatedArticle);
    return updatedArticle;
  }

  async remove(id: number) {
    const article = await this.findById(id);
    await this.articleRepository.remove(article);
    return true;
  }

  private async saveArticle(article: Article) {
    return await this.articleRepository.save(article);
    /*if (!article.lots) return await this.articleRepository.save(article);

    let product = await this.productRepository.findOneByOrFail({
      id: article.productId,
    });

    product = this.productsService.maxMin(
      product,
      article.lots.map(({ price }) => price),
    );

    await this.dataSource.transaction(async (manger) => {
      await manger.getRepository(Product).save(product);
      await manger.getRepository(Article).save(article);
    });*/
  }

  private async findById(id: number) {
    return await this.articleRepository.findOneByOrFail({ id });
  }
}
