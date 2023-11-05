import { Injectable } from '@nestjs/common';
import { CreateArticleGalleryDto } from './dto/create-article-gallery.dto';
import { UpdateArticleGalleryDto } from './dto/update-article-gallery.dto';

@Injectable()
export class ArticleGalleriesService {
  create(createArticleGalleryDto: CreateArticleGalleryDto) {
    return 'This action adds a new articleGallery';
  }

  findAll() {
    return `This action returns all articleGalleries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleGallery`;
  }

  update(id: number, updateArticleGalleryDto: UpdateArticleGalleryDto) {
    return `This action updates a #${id} articleGallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleGallery`;
  }
}
