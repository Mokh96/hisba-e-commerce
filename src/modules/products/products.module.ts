import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ArticlesModule } from '../articles/articles.module';
import { Article } from 'src/modules/articles/entities/article.entity';
import { ArticleGallery } from 'src/modules/article-galleries/entities/article-gallery.entity';
import { ProductsSyncController } from 'src/modules/products/products-sync.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsSyncController , ProductsController ],
  providers: [ProductsService],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
