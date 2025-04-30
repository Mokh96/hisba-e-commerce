import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { SyncBrandController } from './brand-sync.controller';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { FileTypesEnum } from 'src/modules/files/enums/file-types.enum';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [SyncBrandController, BrandsController],
  providers: [
    BrandsService,
    {
      provide: UploadManager,
      useFactory: () => new UploadManager(FileTypesEnum.Public, []),
    },
  ],
  exports: [BrandsService],
})
export class BrandsModule {}
