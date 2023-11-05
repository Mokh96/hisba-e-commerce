import { OrderItem as OrderItemShape } from 'src/common-entities/order-item.common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Lot } from 'src/modules/lots/entities/lot.entity';

@Entity()
export class OrderItem extends OrderItemShape {
  @Column({ ...defaultDecimal, name: 'unite_price_ttc' })
  unitePriceTtc: number;

  @Column({ length: 500 })
  note: string;

  @ManyToOne(() => Order, (order: Order) => order.orderItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  order: Order;

  @ManyToOne(() => Lot, (lot: Lot) => lot.orderItems, {
    nullable: false,
  })
  lot: Lot;
}
