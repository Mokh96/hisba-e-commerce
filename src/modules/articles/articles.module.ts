import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ProductsModule } from 'src/modules/products/products.module';
import { ArticlesSyncController } from './articles-sync.controller';

@Module({
  controllers: [ArticlesSyncController, ArticlesController],
  imports: [TypeOrmModule.forFeature([Article]), ProductsModule],
  providers: [ArticlesService],
  exports: [TypeOrmModule],
})
export class ArticlesModule {}
