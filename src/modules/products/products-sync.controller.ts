import { Controller, Post, Body, Patch, Res, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, CreateSyncProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateSyncProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ParseFormDataArrayPipe } from 'src/common/pipes/parse-form-data-array.pipe';
import { productValidationRulesInterceptor } from 'src/modules/products/config/file-validation.config';
import { ParseFormDataArrayInterceptor } from 'src/common/interceptors/parse-form-data-array.interceptor';
import { ValidateBulkDtoInterceptor } from 'src/common/interceptors/validate-bulk-dto.Interceptor';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';

@Controller('products/sync')
export class ProductsSyncController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('bulk')
  @UseInterceptors(
    AnyFilesInterceptor(),
    ParseFormDataArrayInterceptor,
    new ValidateBulkDtoInterceptor(CreateSyncProductDto),
    productValidationRulesInterceptor,
  )
  async createBulk(
    @Res() res: Response,
    @Body() createSyncProductsDto: CreateSyncProductDto[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.productsService.createBulk(createSyncProductsDto, files);
    const status = getBulkStatus({ failures: response.failures.length, success: response.successes.length });
    return res.status(status).json(response);
  }

  @Patch('bulk')
  @UseInterceptors(AnyFilesInterceptor())
  async updateBulk(
    @Res() res: Response,
    @Body(ParseFormDataArrayPipe) updateSyncProductDto: UpdateSyncProductDto[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.productsService.updateBulk(updateSyncProductDto, files);
    return res.status(207).json(response);
  }

  /* @Patch(':id')
   update(@Param('id') id: string, @Body() updateSyncProductDto: UpdateSyncProductDto) {
     return this.productsService.update(+id, updateSyncProductDto);
   }*/
}
