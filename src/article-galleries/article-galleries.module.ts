import { Module } from '@nestjs/common';
import { ArticleGalleriesService } from './article-galleries.service';
import { ArticleGalleriesController } from './article-galleries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleGallery } from './entities/article-gallery.entity';

@Module({
  controllers: [ArticleGalleriesController],
  providers: [ArticleGalleriesService],
  imports: [TypeOrmModule.forFeature([ArticleGallery])],
})
export class ArticleGalleriesModule {}
