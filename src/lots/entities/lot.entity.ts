import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_disponible', default: true })
  isDisponible: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column()
  code: string;

  @Column()
  reference: string;

  @Column({ name: 'n_series' })
  nSeries: string;

  @Column({ name: 'n_lot' })
  nLot: string;

  @Column({ ...defaultDecimal })
  price: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'double', default: 0 })
  tva: number;

  @Column({ name: 'date_exp', type: 'datetime', nullable: true })
  dateExp: Date;
}
