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

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoriesModule, BrandsModule],
  controllers: [ProductsSyncController, ProductsController , FiltersController],
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
