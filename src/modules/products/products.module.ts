import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsSyncController } from 'src/modules/products/products-sync.controller';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { FileTypesEnum } from 'src/modules/files/enums/file-types.enum';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { BrandsModule } from 'src/modules/brands/brands.module';
import { FiltersController } from 'src/modules/products/filters.controller';
import { FileValidationInterceptorModule } from 'src/common/file-validation/file-validation.module';
import { createProductValidationRules } from 'src/modules/products/config/file-validation.config';
import { PRODUCT_VALIDATION_INTERCEPTOR } from 'src/common/file-validation/file-validation.tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
    BrandsModule,
    FileValidationInterceptorModule.register(createProductValidationRules, PRODUCT_VALIDATION_INTERCEPTOR),
  ],
  controllers: [ProductsSyncController, ProductsController, FiltersController],
  providers: [
    ProductsService,
    {
      provide: UploadManager,
      useFactory: () => new UploadManager(FileTypesEnum.Public, ['service']),
    },
  ],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
