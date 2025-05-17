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
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { imageUploadRules } from 'src/modules/files/config/file-upload.config';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { productValidationRulesInterceptor } from 'src/modules/products/config/file-validation.config';
import { FileValidationInterceptor } from 'src/modules/files/interceptors/file-validation-interceptor';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { ProductFilterDto } from 'src/modules/products/dto/product-filter.dto';
import { DeepPartial } from 'typeorm';
import { f } from 'src/modules/products/test';
import { translate } from 'src/startup/i18n/i18n.provider';
import { I18nTranslations } from 'src/startup/i18n/generated/i18n.generated';
import { I18n, I18nContext } from 'nestjs-i18n';

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
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: ProductFilterDto,
  ): Promise<PaginatedResult<DeepPartial<Product>>> {
    return this.productsService.findAll(paginationDto, filterDto);
  }

  /*  @Get()
    findAll(@I18n() i18n: I18nContext<I18nTranslations>) {
      const res = translate('common.validation.FAILED', { args: { name: 'test' } });
      const res2 = i18n.t('common.greeting', { args: { name: 'test' } });
  
      return {
        res,
        res2: res2,
      };
    }*/

  @Get('price-range')
  async getPriceRange() {
    return await this.productsService.getPriceRange();
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
