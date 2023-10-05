import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleGalleryDto } from './create-article-gallery.dto';

export class UpdateArticleGalleryDto extends PartialType(CreateArticleGalleryDto) {}
