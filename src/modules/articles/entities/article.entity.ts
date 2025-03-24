import { ArticleGallery } from 'src/modules/article-galleries/entities/article-gallery.entity';
import { SyncEntityCommon } from 'src/common-entities/sync.entity';
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
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { CartItem } from '../../cart-items/entities/cart-item.entity';
import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';

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

  @Column(defaultDecimal)
  price: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

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

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.article, {
    cascade: ['insert'],
  })
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (item: CartItem) => item.article, {
    cascade: ['insert'],
  })
  cartItems: CartItem[];

  @ManyToMany(() => OptionsValue, (value: OptionsValue) => value.articles)
  @JoinTable()
  optionValues: OptionsValue[];
}
