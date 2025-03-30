import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  ParseArrayPipe,
  Res,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, CreateSyncProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateSyncProductDto } from './dto/update-product.dto';
import { validateBulk } from 'src/helpers/validation/validation';
import { validateBulkDto } from 'src/helpers/validation/validate-bulk-dto';
import { Response } from 'express';
import { IsArrayPipe } from 'src/common/pipes/isArray.pipe';
import { CreateClientSyncDto } from 'src/modules/clients/dto/create-client.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ParseFormDataArrayPipe } from 'src/common/pipes/parse-form-data-array.pipe';
import { BulkFileValidationInterceptor } from 'src/modules/files/interceptors/bulk-file-validation-interceptor';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { imageUploadRules } from 'src/modules/files/config/file-upload.config';

@Controller('products/sync')
export class ProductsSyncController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createSyncProductDto: CreateSyncProductDto) {
    return this.productsService.create(createSyncProductDto);
  }

  @Post('bulk')
  @UseInterceptors(AnyFilesInterceptor())
  async createBulk(
    @Res() res: Response,
    @Body(ParseFormDataArrayPipe) createSyncProductsDto: CreateSyncProductDto[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.productsService.createBulk(createSyncProductsDto, files);
    return res.status(207).json(response);
  }

  @Patch('bulk')
  @UseInterceptors(AnyFilesInterceptor())
  async updateBulk(
    @Res() res: Response,
    @Body(ParseFormDataArrayPipe) updateSyncProductDto: UpdateSyncProductDto[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.productsService.updateBulk(updateSyncProductDto, files as any);
    return res.status(207).json(response);
  }

  /* @Patch(':id')
   update(@Param('id') id: string, @Body() updateSyncProductDto: UpdateSyncProductDto) {
     return this.productsService.update(+id, updateSyncProductDto);
   }*/
}
