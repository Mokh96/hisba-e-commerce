import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductGalleriesService } from './product-galleries.service';
import { CreateProductGalleryDto } from './dto/create-product-gallery.dto';
import { UpdateProductGalleryDto } from './dto/update-product-gallery.dto';

@Controller('product-galleries')
export class ProductGalleriesController {
  constructor(private readonly productGalleriesService: ProductGalleriesService) {}

  @Post()
  create(@Body() createProductGalleryDto: CreateProductGalleryDto) {
    return this.productGalleriesService.create(createProductGalleryDto);
  }

  @Get()
  findAll() {
    return this.productGalleriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productGalleriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductGalleryDto: UpdateProductGalleryDto) {
    return this.productGalleriesService.update(+id, updateProductGalleryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productGalleriesService.remove(+id);
  }
}
