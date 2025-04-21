import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SyncCategoryController } from './category-sync.controller';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { FileTypesEnum } from 'src/modules/files/enums/file-types.enum';

@Module({
  controllers: [SyncCategoryController, CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: UploadManager,
      useFactory: () => new UploadManager(FileTypesEnum.Public, []),
    },
  ],
  imports: [TypeOrmModule.forFeature([Category])],
})
export class CategoriesModule {}
