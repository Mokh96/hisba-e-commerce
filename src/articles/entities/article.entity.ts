import { ArticleGallery } from 'src/article-galleries/entities/article-gallery.entity';
import { Lot } from 'src/lots/entities/lot.entity';
import { OptionsValue } from 'src/options-values/entities/options-value.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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
  ref: string;

  @Column({ length: 500, nullable: true })
  note: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_multi_lot', default: false })
  isMultiLot: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ArticleGallery, (image: ArticleGallery) => image.article)
  gallery: ArticleGallery[];

  @OneToMany(() => Lot, (lot: Lot) => lot.article)
  lots: Lot[];

  @ManyToMany(() => OptionsValue, (value: OptionsValue) => value.articles)
  @JoinTable()
  optionValues: OptionsValue[];
}
