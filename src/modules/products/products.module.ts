import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsSyncController } from 'src/modules/products/products-sync.controller';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { FileTypesEnum } from 'src/modules/files/enums/file-types.enum';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsSyncController, ProductsController],
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
