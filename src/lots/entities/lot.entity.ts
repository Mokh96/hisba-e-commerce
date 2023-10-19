import { Article } from 'src/articles/entities/article.entity';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

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
  ref: string;

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

  @ManyToOne(() => Article, (article: Article) => article.lots, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  article: Article;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.lot)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.lot)
  cartItems: CartItem[];
}
