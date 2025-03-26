import { Injectable } from '@nestjs/common';
import { CreateSyncArticleDto } from './dto/create-article.dto';
import { UpdateSyncArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ProductsService } from 'src/modules/products/products.service';
import { QueryArticleDto } from './dto/query-article.dto';
import { fromDtoToQuery } from 'src/helpers/function.global';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
    private productsService: ProductsService,
  ) {}

  async create(createArticleDto: CreateSyncArticleDto) {
    const article = this.articleRepository.create(createArticleDto);

    await this.saveArticle(article);
    return article;
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
