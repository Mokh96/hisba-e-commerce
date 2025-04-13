import { LabelSync } from 'src/common-entities/label.common.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class PaymentMethod extends LabelSync {
  @Column({ name: 'is_stamp', default: false })
  isStamp: boolean;

  @OneToMany(() => Order, (order: Order) => order.paymentMethod)
  orders: Order[];
}
