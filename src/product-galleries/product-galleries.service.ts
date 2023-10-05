import { Injectable } from '@nestjs/common';
import { CreateProductGalleryDto } from './dto/create-product-gallery.dto';
import { UpdateProductGalleryDto } from './dto/update-product-gallery.dto';

@Injectable()
export class ProductGalleriesService {
  create(createProductGalleryDto: CreateProductGalleryDto) {
    return 'This action adds a new productGallery';
  }

  findAll() {
    return `This action returns all productGalleries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productGallery`;
  }

  update(id: number, updateProductGalleryDto: UpdateProductGalleryDto) {
    return `This action updates a #${id} productGallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} productGallery`;
  }
}
