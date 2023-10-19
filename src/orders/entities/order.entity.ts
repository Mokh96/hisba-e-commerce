import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Order as OrderShape } from '../../common-entities/order.common.entity';
import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { OrderStatus } from 'src/order-status/entities/order-status.entity';
import { OrderHistory } from 'src/order-history/entities/order-history.entity';
import { Tier } from 'src/tiers/entities/tier.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Order extends OrderShape {
  @Column({ nullable: true })
  note: string;

  @Column({ name: 'tier_name' })
  tierName: string;

  @Column({ name: 'delivery_address' })
  deliveryAddress: string;

  @Column({ name: 'tier_phone', length: 13 })
  tierPhone: string;

  @Column({ name: 'tier_info', type: 'text' })
  tierInfo: string;

  @Column({ ...defaultDecimal, default: 0 })
  discount?: number;

  @Column({ name: 'discount_percentage', default: 0, type: 'double' })
  discountPercentage?: number;

  @Column({ ...defaultDecimal, name: 'stamp_duty', default: 0 })
  stampDuty: number;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(
    () => PaymentMethod,
    (paymentMethod: PaymentMethod) => paymentMethod.orders,
    {
      nullable: false,
    },
  )
  paymentMethod: PaymentMethod;

  @ManyToOne(() => OrderStatus, (status: OrderStatus) => status.orders, {
    nullable: false,
  })
  status: OrderStatus;

  @OneToMany(() => OrderHistory, (history: OrderHistory) => history.order, {
    nullable: false,
  })
  history: OrderHistory[];

  @ManyToOne(() => Tier, (tier: Tier) => tier.orders, { nullable: false })
  tier: Tier;

  @ManyToOne(() => User, (user: User) => user.createdOrders, {
    nullable: false,
  })
  creator: User;
}
