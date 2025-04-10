import { OptionsValue } from 'src/modules/options-values/entities/options-value.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { CartItem } from '../../cart-items/entities/cart-item.entity';
import { decimalColumnOptions } from 'src/entities-helpers/columnOptions.helper';
import { ARTICLE_FIELD_LENGTHS } from 'src/modules/articles/config/articles.config';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';

@Entity()
export class Article extends WithTimestamp(WithSyncId(BaseEntity)) {
  @Column({length: ARTICLE_FIELD_LENGTHS.LABEL })
  label: string;

  @Column({ name: 'default_img_path', nullable: true, length: ARTICLE_FIELD_LENGTHS.IMG_PATH })
  defaultImgPath: string;//todo rename to image path

  @Column({ nullable: true, length: ARTICLE_FIELD_LENGTHS.REF })
  ref: string;

  @Column({ nullable: true, length: ARTICLE_FIELD_LENGTHS.NOTE })
  note: string;

  @Column({ nullable: true, length: ARTICLE_FIELD_LENGTHS.DESCRIPTION })
  description: string;

  @Column({ ...decimalColumnOptions, default: 0 })
  price: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (product: Product) => product.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.article, { cascade: ['insert'] })
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (item: CartItem) => item.article, { cascade: ['insert'] })
  cartItems: CartItem[];

  @ManyToMany(() => OptionsValue, (value: OptionsValue) => value.articles)
  @JoinTable()
  optionValues: OptionsValue[];
}
