import { Article } from 'src/articles/entities/article.entity';
import { Gallery } from 'src/common-entities/gallery.common.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class ArticleGallery extends Gallery {
  @ManyToOne(() => Article, (article: Article) => article.gallery, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  article: Article;
}
