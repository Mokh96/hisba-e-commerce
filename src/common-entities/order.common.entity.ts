import { decimalColumnOptions } from 'src/entities-helpers/columnOptions.helper';
import {
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class OrderCommon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ ...decimalColumnOptions, name: 'amount_ht' })
  amountHt: number;

  @Column({ ...decimalColumnOptions, name: 'net_amount_ttc' })
  netAmountTtc: number;

  @Column({ ...decimalColumnOptions, name: 'net_to_pay' })
  netToPay: number;

  @Column({ ...decimalColumnOptions, name: 'total_tva' })
  totalTva: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}

export abstract class OrderSync extends OrderCommon {
  @Column({ name: 'sync_id', nullable: true })
  @Index('sync_id', { unique: true })
  syncId: number;
}
