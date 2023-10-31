import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [ArticlesController],
  imports: [TypeOrmModule.forFeature([Article]), ProductsModule],
  providers: [ArticlesService],
})
export class ArticlesModule {}
