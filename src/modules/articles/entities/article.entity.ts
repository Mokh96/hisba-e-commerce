import { ArticleGallery } from 'src/modules/article-galleries/entities/article-gallery.entity';
import { SyncEntityCommon } from 'src/common-entities/sync.entity';
import { Lot } from 'src/modules/lots/entities/lot.entity';
import { OptionsValue } from 'src/modules/options-values/entities/options-value.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Article extends SyncEntityCommon {
  @Column({ nullable: true })
  label: string;

  @Column({ name: 'img_path', nullable: true })
  imgPath: string;

  @Column({ nullable: true })
  ref: string;

  @Column({ length: 500, nullable: true })
  note: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_multi_lot', default: true })
  isMultiLot: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, (product: Product) => product.articles)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: number;

  @OneToMany(() => ArticleGallery, (image: ArticleGallery) => image.article)
  gallery: ArticleGallery[];

  @OneToMany(() => Lot, (lot: Lot) => lot.article, { cascade: true })
  lots: Lot[];

  @ManyToMany(() => OptionsValue, (value: OptionsValue) => value.articles)
  @JoinTable()
  optionValues: OptionsValue[];
}
