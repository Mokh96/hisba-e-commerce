import { GalleryCommon } from 'src/common-entities/gallery.common.entity';
import { Article } from 'src/modules/articles/entities/article.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class ArticleGallery extends GalleryCommon {
  @ManyToOne(() => Article, (article: Article) => article.gallery, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  article: Article;
}
