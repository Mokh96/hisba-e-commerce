import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = this.articleRepository.create(createArticleDto);
    await this.articleRepository.save(article);
    return article;
  }

  async findAll() {
    const articles = await this.articleRepository.find();
    return articles;
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOneBy({ id: id });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    let article = await this.findOne(id);
    const updatedLot = this.articleRepository.merge(article, updateArticleDto);
    await this.articleRepository.save(updatedLot);
    return updatedLot;
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
    return true;
  }
}
