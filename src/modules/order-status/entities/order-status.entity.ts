import { Label } from 'src/common-entities/label.common.entity';
import { OrderHistory } from 'src/modules/order-history/entities/order-history.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class OrderStatus extends Label {
  @OneToMany(() => Order, (order: Order) => order.status)
  orders: Order[];

  @OneToMany(() => OrderHistory, (history: OrderHistory) => history.status)
  history: OrderHistory[];
}
