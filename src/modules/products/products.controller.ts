import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, CreateSyncProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadEnum } from '../files/enums/file-upload.enum';
import { FileValidationInterceptor } from '../files/interceptors/file-validation-interceptor';
import { imageUploadRules } from '../files/config/file-upload.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: FileUploadEnum.Image }]),
    new FileValidationInterceptor({ [FileUploadEnum.Image]: imageUploadRules }),
  )
  create(@Body() createProductDto: CreateProductDto) {
    console.log(createProductDto);
    return createProductDto;
    return this.productsService.create(createProductDto as CreateSyncProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }
}
