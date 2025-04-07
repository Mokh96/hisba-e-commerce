import { Injectable } from '@nestjs/common';
import { CreateProductGalleryDto } from './dto/create-product-gallery.dto';
import { UpdateProductGalleryDto } from './dto/update-product-gallery.dto';

@Injectable()
export class ProductGalleriesService {
  create(createArticleGalleryDto: CreateProductGalleryDto) {
    return 'This action adds a new articleGallery';
  }

  findAll() {
    return `This action returns all articleGalleries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleGallery`;
  }

  update(id: number, updateArticleGalleryDto: UpdateProductGalleryDto) {
    return `This action updates a #${id} articleGallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleGallery`;
  }
}
