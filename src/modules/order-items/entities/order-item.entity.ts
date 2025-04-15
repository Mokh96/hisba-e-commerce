import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { decimalColumnOptions } from 'src/entities-helpers/columnOptions.helper';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Article } from '../../articles/entities/article.entity';
import { ORDER_ITEM_FIELD_LENGTHS } from 'src/modules/order-items/config/order-items.config';
import { WithEntityAttributeUtils } from 'src/common/entities/entity-attribute.entity';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { WithBaseOrderItem } from 'src/common/entities/base-order-item.entity';

const MixedEntities = WithBaseOrderItem(WithTimestamp(WithEntityAttributeUtils(BaseEntity)));

@Entity()
export class OrderItem extends MixedEntities {
  @Column({ nullable: true, length: ORDER_ITEM_FIELD_LENGTHS.ARTICLE_REF })
  articleRef: string | null;

  @Column({ length: ORDER_ITEM_FIELD_LENGTHS.ARTICLE_LABEL })
  articleLabel: string | null;

  @Column({ ...decimalColumnOptions, default: 0 })
  discount: number;

  @Column({ name: 'discount_percentage', default: 0, type: 'double' })
  discountPercentage: number;

  @Column({ ...decimalColumnOptions, name: 'unite_price_ht' })
  unitePriceHt: number;

  @Column({ ...decimalColumnOptions, name: 'unite_price_ttc' })
  unitePriceTtc: number;

  @Column({ name: 'is_out_stock', default: false })
  isOutStock: boolean; // <==> isService (don't have quantity)

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
