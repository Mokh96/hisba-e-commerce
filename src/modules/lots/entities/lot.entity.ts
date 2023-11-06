import { Article } from 'src/modules/articles/entities/article.entity';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { SyncEntity } from 'src/common-entities/sync.entity';
import { defaultDecimal } from 'src/entities-helpers/columnOptions.helper';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Lot extends SyncEntity {
  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  ref: string;

  @Column({ name: 'n_series', nullable: true })
  nSeries: string;

  @Column({ name: 'n_lot', nullable: true })
  nLot: string;

  @Column({ ...defaultDecimal, nullable: false })
  price: number;

  @Column({ length: 500, nullable: true })
  note: string;

  @Column({ type: 'double' })
  tva: number;

  @Column({ name: 'date_exp', nullable: true })
  dateExp: Date;

  @Column({ name: 'is_disponible', default: true })
  isDisponible: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Article, (article: Article) => article.lots, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @Column({ name: 'article_id' })
  articleId: number;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.lot)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.lot)
  cartItems: CartItem[];
}
