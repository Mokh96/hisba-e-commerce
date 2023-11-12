import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateArticleDto,
  CreateSyncArticleDto,
} from './dto/create-article.dto';
import {
  UpdateArticleDto,
  UpdateSyncArticleDto,
} from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ProductsService } from 'src/modules/products/products.service';

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

  async createBulk(createSyncArticleDtos: CreateSyncArticleDto[]) {
    const articles = this.articleRepository.create(createSyncArticleDtos);

    const baseFailures = [];
    const success: Article[] = [];

    for (let i = 0; i < articles.length; i++) {
      try {
        const article = await this.saveArticle(articles[i]);
        success.push(article);
      } catch (error) {
        baseFailures.push({
          syncId: articles[i].syncId,
          error,
        });
      }
    }

    return { success, baseFailures };
  }

  async findAll() {
    const articles = await this.articleRepository.find();
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
    const updatedArticle = this.articleRepository.merge(
      article,
      updateArticleDto,
    );

    await this.articleRepository.save(updatedArticle);
    return updatedArticle;
  }

  async remove(id: number) {
    const article = await this.findById(id);
    await this.articleRepository.remove(article);
    return true;
  }

  private async saveArticle(article: Article) {
    if (!article.lots) return await this.articleRepository.save(article);

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
    });
  }

  private async findById(id: number) {
    return await this.articleRepository.findOneByOrFail({ id });
  }
}
