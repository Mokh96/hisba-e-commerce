import { PartialType } from '@nestjs/mapped-types';
import { CreateProductGalleryDto } from './create-product-gallery.dto';

export class UpdateProductGalleryDto extends PartialType(
  CreateProductGalleryDto,
) {}
