import { OrderItem as OrderItemShape } from 'src/common-entities/order-item.common.entity';
import { Column, Entity } from 'typeorm';
import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';

@Entity()
export class OrderItem extends OrderItemShape {
  @Column({ ...defaultDecimal, name: 'unite_price_ttc' })
  unitePriceTtc: number;

  @Column({ length: 500 })
  note: string;
}
