import { OrderStatus } from 'src/modules/order-status/entities/order-status.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

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
  @JoinColumn({ name: 'status_id' })
  status: OrderStatus;

  @ManyToOne(() => User, (user: User) => user.createdOrderHistory, {
    nullable: false,
  })
  creator: User;
}
