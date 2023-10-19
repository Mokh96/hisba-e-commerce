import { Brand } from 'src/brands/entities/brand.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Family } from 'src/families/entities/family.entity';
import { ProductGallery } from 'src/product-galleries/entities/product-gallery.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'img_path', nullable: true })
  imgPath: boolean;

  @Column()
  code: string;

  @Column()
  ref: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  label2: string;

  @Column()
  note: string;

  @Column()
  description: string;

  @Column({ name: 'min_price' })
  minPrice: string;

  @Column({ name: 'max_price' })
  maxPrice: string;

  @Column({ name: 'is_out_stock', default: false })
  isOutStock: boolean;

  @Column({ name: 'is_expired', default: true })
  isExpired: boolean;

  @Column({ name: 'is_multi_article', default: false })
  isMultiArticle: boolean;

  @ManyToOne(() => Brand, (brand: Brand) => brand.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  brand: Brand;

  @ManyToOne(() => Category, (category: Category) => category.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  category: Category;

  @ManyToOne(() => Family, (family: Family) => family.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  family: Family;

  @OneToMany(() => ProductGallery, (image: ProductGallery) => image.product)
  gallery: ProductGallery[];
}
