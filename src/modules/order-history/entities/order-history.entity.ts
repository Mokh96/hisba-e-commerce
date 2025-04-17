import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderStatus } from 'src/modules/system-entities/entities/order-status.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { OrderStatus  as OrderStatusEnum} from 'src/common/enums/order-status.enum';
@Entity()
export class OrderHistory extends WithTimestamp(BaseEntity) {
  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'status_id' })
  statusId: OrderStatusEnum;

  @Column({ name: 'creator_id' })
  creatorId: number;

  @ManyToOne(() => OrderStatus, (status: OrderStatus) => status.history, {
    nullable: false,
  })
  @JoinColumn({ name: 'status_id' })
  status: OrderStatus;

  @ManyToOne(() => Order, (order: Order) => order.history, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User, (user: User) => user.createdOrderHistory, {
    nullable: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;
}
