import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { imageUploadRules } from 'src/modules/files/config/file-upload.config';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import {
  productValidationRulesInterceptor,
} from 'src/modules/products/config/file-validation.config';
import { FileValidationInterceptor } from 'src/modules/files/interceptors/file-validation-interceptor';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor(), productValidationRulesInterceptor)
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.productsService.create(createProductDto, files);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: FileUploadEnum.Image }]),
    new FileValidationInterceptor({ [FileUploadEnum.Image]: imageUploadRules }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: { [FileUploadEnum.Image]: Express.Multer.File[] },
  ) {
    return this.productsService.update(id, updateProductDto, files);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }
}
