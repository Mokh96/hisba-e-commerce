import { MixinConstructor } from 'src/common/types/entities.types';
import { Column } from 'typeorm';
import { ORDER_ITEM_FIELD_LENGTHS } from 'src/modules/order-items/config/order-items.config';

export function WithBaseOrderItem<TBase extends MixinConstructor>(Base: TBase) {
  class BaseOrderEntity extends Base {
    @Column({ default: 0, type: 'int' })
    quantity: number;

    @Column({ length: ORDER_ITEM_FIELD_LENGTHS.NOTE, nullable: true })
    note: string | null;

    @Column()
    offset: number;
  }

  return BaseOrderEntity;
}
