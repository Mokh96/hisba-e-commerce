import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductGalleriesService } from './product-galleries.service';
import { CreateProductGalleryDto } from './dto/create-product-gallery.dto';
import { UpdateProductGalleryDto } from './dto/update-product-gallery.dto';

@Controller('product-galleries')
export class ProductGalleriesController {
  constructor(
    private readonly articleGalleriesService: ProductGalleriesService,
  ) {}

  @Post()
  create(@Body() createArticleGalleryDto: CreateProductGalleryDto) {
    return this.articleGalleriesService.create(createArticleGalleryDto);
  }

  @Get()
  findAll() {
    return this.articleGalleriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleGalleriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleGalleryDto: UpdateProductGalleryDto,
  ) {
    return this.articleGalleriesService.update(+id, updateArticleGalleryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articleGalleriesService.remove(+id);
  }
}
