import { Label } from 'src/common-entities/label.common.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class PaymentMethod extends Label {
  @Column({ name: 'is_stamp', default: false })
  isStamp: boolean;

  @OneToMany(() => Order, (order: Order) => order.paymentMethod)
  orders: Order[];
}
