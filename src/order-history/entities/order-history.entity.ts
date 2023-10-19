import { OrderStatus } from 'src/order-status/entities/order-status.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class OrderHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order: Order) => order.history, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  order: Order;

  @ManyToOne(() => OrderStatus, (status: OrderStatus) => status.history, {
    nullable: false,
  })
  status: OrderStatus;

  @ManyToOne(() => User, (user: User) => user.createdOrderHistory, {
    nullable: false,
  })
  creator: User;
}
