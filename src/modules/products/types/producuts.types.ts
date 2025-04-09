import { CreateProductDto } from 'src/modules/products/dto/create-product.dto';
import { ProductGallery } from 'src/modules/product-galleries/entities/product-gallery.entity';
import { Product } from 'src/modules/products/entities/product.entity';

export type CreateProductWithImagesDto = CreateProductDto &
  Pick<Product, 'defaultImgPath'> & {
    gallery: Pick<ProductGallery, 'path'>[];
  } & {
    articles: CreateProductDto['articles'] & { imgPath: string }[];
  };
