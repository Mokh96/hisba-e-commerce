import { ArticleGallery } from 'src/article-galleries/entities/article-gallery.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  label: string;

  @Column({ name: 'img_path', nullable: true })
  imgPath: string;

  @Column()
  reference: string;

  @Column({ length: 500, nullable: true })
  note: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_multi_lot', default: false })
  isMultiLot: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @OneToMany(() => ArticleGallery, (image: ArticleGallery) => image.article)
  gallery: ArticleGallery[];
}
