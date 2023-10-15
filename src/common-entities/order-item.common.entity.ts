import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  reference: string;

  @Column({ ...defaultDecimal, default: 0 })
  quantity: number;

  @Column({ nullable: true })
  label: string;

  @Column({ ...defaultDecimal, default: 0 })
  discount: number;

  @Column({ ...defaultDecimal, default: 0, name: 'discount_percentage' })
  discountPercentage: number;

  @Column({ ...defaultDecimal, default: 0, name: 'tva_percentage' })
  tvaPercentage: number;

  @Column({ ...defaultDecimal, name: 'unite_price_ht' })
  unitePriceHt: number;

  @Column({ name: 'is_out_stock', default: false })
  isOutStock: boolean;

  @Column()
  offset: number;

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
