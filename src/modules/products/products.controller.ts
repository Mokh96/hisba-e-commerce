import {
  Body,
  Controller,
  Delete,
  Get,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadEnum } from '../files/enums/file-upload.enum';
import { FileValidationInterceptor } from '../files/interceptors/file-validation-interceptor';
import { imageUploadRules } from '../files/config/file-upload.config';
import { UploadManager3 } from 'src/modules/files/upload/upload-manager';
import { FilesTypesEnum } from 'src/modules/files/enums/files-types.enum';

@Controller('products')
export class ProductsController extends UploadManager3 {
  constructor(private readonly productsService: ProductsService) {
    //new ThumbnailManager({ thumbnailSize: { width: 250, height: 250 } })
    super(FilesTypesEnum.Private, []);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: FileUploadEnum.Image }]),
    new FileValidationInterceptor({ [FileUploadEnum.Image]: imageUploadRules }),
  )
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: { image?: Express.Multer.File[] }) {
    const uploadedFiles = await this.uploadFiles(files, ['articles']);
    return {
      uploadedFiles,
      createProductDto,
    };
    //return this.productsService.create(createProductDto);
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
