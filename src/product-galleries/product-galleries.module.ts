import { Module } from '@nestjs/common';
import { ProductGalleriesService } from './product-galleries.service';
import { ProductGalleriesController } from './product-galleries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductGallery } from './entities/product-gallery.entity';

@Module({
  controllers: [ProductGalleriesController],
  providers: [ProductGalleriesService],
  imports: [TypeOrmModule.forFeature([ProductGallery])],
})
export class ProductGalleriesModule {}
