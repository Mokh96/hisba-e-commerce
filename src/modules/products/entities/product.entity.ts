import { Article } from 'src/modules/articles/entities/article.entity';
import { Brand } from 'src/modules/brands/entities/brand.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Family } from 'src/modules/families/entities/family.entity';
import { ProductGallery } from 'src/modules/product-galleries/entities/product-gallery.entity';
import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';

import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SyncEntity } from 'src/common-entities/sync.entity';

@Entity()
export class Product extends SyncEntity {
  @Column({ name: 'img_path', nullable: true })
  imgPath: boolean;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  ref: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  label2: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  description: string;

  @Column({ ...defaultDecimal, name: 'min_price', default: 0 })
  minPrice: number;

  @Column({ ...defaultDecimal, name: 'max_price', default: 0 })
  maxPrice: number;

  @Column({ name: 'is_out_stock', default: false })
  isOutStock: boolean;

  @Column({ name: 'is_expired', default: true })
  isExpired: boolean;

  @Column({ name: 'is_multi_article', default: false })
  isMultiArticle: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Article, (article: Article) => article.product, {
    cascade: ['insert'],
  })
  articles: Article[];

  @ManyToOne(() => Brand, (brand: Brand) => brand.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ name: 'brand_id', nullable: true })
  brandId: number;

  @ManyToOne(() => Category, (category: Category) => category.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @ManyToOne(() => Family, (family: Family) => family.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'family_id' })
  family: Family;

  @Column({ name: 'family_id', nullable: true })
  familyId: number;

  @OneToMany(() => ProductGallery, (image: ProductGallery) => image.product)
  gallery: ProductGallery[];
}
