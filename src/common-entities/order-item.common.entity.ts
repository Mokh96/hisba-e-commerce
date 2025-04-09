import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { ORDER_ITEM_FIELD_LENGTHS } from 'src/modules/order-items/config/order-items.config';

export class OrderItemCommon extends WithTimestamp(BaseEntity) {
  @Column({ ...defaultDecimal, default: 0 })
  quantity: number;

  @Column({ length: ORDER_ITEM_FIELD_LENGTHS.NOTE, nullable: true })
  note: string | null;

  @Column()
  offset: number;
}
