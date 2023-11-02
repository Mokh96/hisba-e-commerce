import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

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

  async create(createArticleDto: CreateArticleDto) {
    const article = this.articleRepository.create(createArticleDto);
    await this.saveArticle(article);
    return article;
  }

  async findAll() {
    const articles = await this.articleRepository.find();
    return articles;
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id: id },
      relations: ['lots', 'gallery', 'optionValues'],
    });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {

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
    let product = await this.productRepository.findOneByOrFail({
      id: article.productId,
    });

    product = this.productsService.maxMin(
      product,
      article.lots.map(({ price }) => price),
    );

    this.dataSource.transaction(async (manger) => {
      await manger.getRepository(Product).save(product);
      await manger.getRepository(Article).save(article);
    });
  }

  private async findById(id: number) {
    return await this.articleRepository.findOneByOrFail({ id });
  }
}
