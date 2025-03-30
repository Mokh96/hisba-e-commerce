import { CreateProductDto } from 'src/modules/products/dto/create-product.dto';
import { ArticleGallery } from 'src/modules/article-galleries/entities/article-gallery.entity';

export type CreateProductWithImagesDto = CreateProductDto & { imgPath: string } & {
  articles: CreateProductDto['articles'] & { imgPath: string; gallery: Pick<ArticleGallery, 'path'>[] }[];
}