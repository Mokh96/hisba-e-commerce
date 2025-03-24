import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { OrderSync } from 'src/common-entities/order.common.entity';
import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { PaymentMethod } from 'src/modules/payment-methods/entities/payment-method.entity';
import { OrderStatus } from 'src/modules/order-status/entities/order-status.entity';
import { OrderHistory } from 'src/modules/order-history/entities/order-history.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Order extends OrderSync {
  @Column({ nullable: true })
  note: string;

  @Column({ name: 'client_first_name' })
  clientFirstName: string;

  @Column({ name: 'client_last_name' })
  clientLastName: string;

  @Column({ name: 'client_mobile', length: 13 })
  clientMobile: string;

  @Column({ name: 'client_phone', length: 13 })
  clientPhone: string;

  @Column({ name: 'client_fax', length: 13 })
  clientFax: string;

  @Column({ name: 'delivery_address' })
  deliveryAddress: string;

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

  @ManyToOne(() => Client, (client: Client) => client.orders, {
    nullable: false,
  })
  client: Client;

  @ManyToOne(() => User, (user: User) => user.createdOrders, {
    nullable: false,
  })
  creator: User;
}
