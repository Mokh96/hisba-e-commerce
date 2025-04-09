import { Article } from 'src/modules/articles/entities/article.entity';
import { Brand } from 'src/modules/brands/entities/brand.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Family } from 'src/modules/families/entities/family.entity';
import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PRODUCT_FIELD_LENGTHS } from '../config/products.config';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { ProductGallery } from 'src/modules/product-galleries/entities/product-gallery.entity';


@Entity()
export class Product extends WithTimestamp(WithSyncId(BaseEntity)) {
  @Column({ nullable: true, length: PRODUCT_FIELD_LENGTHS.CODE })
  code: string;

  @Column({ name: 'default_img_path', nullable: true, length: PRODUCT_FIELD_LENGTHS.IMG_PATH })
  defaultImgPath: string;

  @Column({ nullable: true, length: PRODUCT_FIELD_LENGTHS.REF })
  ref: string;

  @Column({ length: PRODUCT_FIELD_LENGTHS.LABEL })
  label: string;

  @Column({ nullable: true, length: PRODUCT_FIELD_LENGTHS.LABEL2 })
  label2: string;

  @Column({ nullable: true, length: PRODUCT_FIELD_LENGTHS.NOTE })
  note: string;

  @Column({ nullable: true, length: PRODUCT_FIELD_LENGTHS.DESCRIPTION })
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

  @Column({ name: 'brand_id', nullable: true })
  brandId: number;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @Column({ name: 'family_id', nullable: true })
  familyId: number;

  @OneToMany(() => Article, (article: Article) => article.product, { cascade: ['insert'] })
  articles: Article[];

  @OneToMany(() => ProductGallery, (image: ProductGallery) => image.product)
  gallery: ProductGallery[];

  @ManyToOne(() => Brand, (brand: Brand) => brand.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Category, (category: Category) => category.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Family, (family: Family) => family.products, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'family_id'  })
  family: Family;
/*  @OneToMany(() => ProductGallery, (image: ProductGallery) => image.product)
  gallery: ProductGallery[];*/
}


class Image {
  img: string[];
}