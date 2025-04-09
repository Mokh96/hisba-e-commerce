import { OrderItemCommon } from 'src/common-entities/order-item.common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Article } from '../../articles/entities/article.entity';
import { ORDER_ITEM_FIELD_LENGTHS } from 'src/modules/order-items/config/order-items.config';

@Entity()
export class OrderItem extends OrderItemCommon {
  @Column({ nullable: true, length: ORDER_ITEM_FIELD_LENGTHS.NOTE })
  note: string | null;

  @Column({ nullable: true, length: ORDER_ITEM_FIELD_LENGTHS.ARTICLE_REF })
  articleRef: string | null;

  @Column({ length: ORDER_ITEM_FIELD_LENGTHS.ARTICLE_LABEL })
  articleLabel: string | null;

  @Column({ ...defaultDecimal, default: 0 })
  discount: number;

  @Column({ name: 'discount_percentage', default: 0, type: 'double' })
  discountPercentage: number;

  @Column({ ...defaultDecimal, name: 'unite_price_ht' })
  unitePriceHt: number;

  @Column({ ...defaultDecimal, name: 'unite_price_ttc' })
  unitePriceTtc: number;

  @Column({ name: 'is_out_stock', default: false })
  isOutStock: boolean;// <==> isService (don't have quantity)

  @Column({ name: 'article_id', type: 'int' })
  articleId: number;

  @Column({ name: 'order_id', type: 'int' })
  orderId: number;

  @ManyToOne(() => Order, (order: Order) => order.orderItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Article, (article: Article) => article.orderItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'article_id' })
  article: Article;
}
