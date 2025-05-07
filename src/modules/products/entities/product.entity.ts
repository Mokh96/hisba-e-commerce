import { Article } from 'src/modules/articles/entities/article.entity';
import { Brand } from 'src/modules/brands/entities/brand.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { decimalColumnOptions } from 'src/entities-helpers/columnOptions.helper';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PRODUCT_FIELD_LENGTHS } from '../config/products.config';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { ProductGallery } from 'src/modules/product-galleries/entities/product-gallery.entity';
import { WithGpsCoordinates } from 'src/common/entities/gps-coordinates.entity';
import { WithEntityAttributeUtils } from 'src/common/entities/entity-attribute.entity';
import { Filterable, FilterType } from 'src/common/decorators/metadata/filterable.decorator';

const MixedEntities = WithTimestamp(WithSyncId(WithEntityAttributeUtils(BaseEntity)));

@Entity()
export class Product extends MixedEntities {
  @Filterable(FilterType.SEARCH, FilterType.FILTERS)
  @Column({ nullable: true, length: PRODUCT_FIELD_LENGTHS.CODE })
  code: string;

  @Column({ name: 'default_img_path', nullable: true, length: PRODUCT_FIELD_LENGTHS.IMG_PATH })
  defaultImgPath: string;

  @Filterable(FilterType.SEARCH, FilterType.FILTERS)
  @Column({ nullable: true, length: PRODUCT_FIELD_LENGTHS.REF })
  ref: string;

  @Filterable(FilterType.SEARCH, FilterType.FILTERS)
  @Column({ length: PRODUCT_FIELD_LENGTHS.LABEL })
  label: string;

  @Filterable(FilterType.SEARCH, FilterType.FILTERS)
  @Column({ nullable: true, length: PRODUCT_FIELD_LENGTHS.LABEL2 })
  label2: string;

  @Filterable(FilterType.SEARCH, FilterType.FILTERS)
  @Column({ nullable: true, length: PRODUCT_FIELD_LENGTHS.NOTE })
  note: string;

  @Filterable(FilterType.SEARCH, FilterType.FILTERS)
  @Column({ nullable: true, length: PRODUCT_FIELD_LENGTHS.DESCRIPTION })
  description: string;

  @Filterable(FilterType.IN, FilterType.GT, FilterType.LT, FilterType.GTE, FilterType.LTE, FilterType.FILTERS)
  @Column({ ...decimalColumnOptions, name: 'max_price', default: 0 })
  maxPrice: number;

  @Filterable(FilterType.IN, FilterType.GT, FilterType.LT, FilterType.GTE, FilterType.LTE, FilterType.FILTERS)
  @Column({ ...decimalColumnOptions, name: 'min_price', default: 0 })
  minPrice: number;

  @Filterable(FilterType.FILTERS)
  @Column({ name: 'is_out_stock', default: false })
  isOutStock: boolean;

  @Filterable(FilterType.FILTERS)
  @Column({ name: 'is_expired', default: true })
  isExpired: boolean;

  @Filterable(FilterType.FILTERS)
  @Column({ name: 'is_multi_article', default: false })
  isMultiArticle: boolean;

  @Filterable(FilterType.FILTERS)
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Filterable(FilterType.IN)
  @Column({ name: 'brand_id', nullable: true })
  brandId: number;

  @Filterable(FilterType.IN)
  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @OneToMany(() => Article, (article: Article) => article.product, { cascade: ['insert'] })
  articles: Article[];

  @OneToMany(() => ProductGallery, (image: ProductGallery) => image.product, { cascade: ['insert', 'remove'] })
  gallery: ProductGallery[]; //todo : If you use cascade when deleting, delete the files as well.

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
}
