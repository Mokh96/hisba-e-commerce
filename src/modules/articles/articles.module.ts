import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ProductsModule } from 'src/modules/products/products.module';
import { ArticlesSyncController } from './articles-sync.controller';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { FileTypesEnum } from 'src/modules/files/enums/file-types.enum';

@Module({
  controllers: [ArticlesSyncController, ArticlesController],
  imports: [TypeOrmModule.forFeature([Article]), ProductsModule],
  providers: [
    ArticlesService,
    {
      provide: UploadManager,
      useFactory: () => new UploadManager(FileTypesEnum.Public, ['articles']),
    },
  ],
  exports: [TypeOrmModule, ArticlesService],
})
export class ArticlesModule {}
