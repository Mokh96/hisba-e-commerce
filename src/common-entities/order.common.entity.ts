import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import {
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ ...defaultDecimal, name: 'amount_ht' })
  amountHt: number;

  @Column({ ...defaultDecimal, name: 'net_amount_ttc' })
  netAmountTtc: number;

  @Column({ ...defaultDecimal, name: 'net_to_pay' })
  netToPay: number;

  @Column({ ...defaultDecimal, name: 'total_tva' })
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

export abstract class OrderSync extends Order {
  @Column({ name: 'sync_id', nullable: true })
  @Index('sync_id', { unique: true })
  syncId: number;
}
