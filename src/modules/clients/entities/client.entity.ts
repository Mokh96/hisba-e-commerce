import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { ShippingAddress } from 'src/modules/shipping-addresses/entities/shipping-address.entity';
import { Town } from 'src/modules/system-entities/entities/town.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { WithEntityAttributeUtils } from 'src/common/entities/entity-attribute.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';

const MixedEntities = WithTimestamp(WithSyncId(WithEntityAttributeUtils(BaseEntity)));

@Entity()
export class Client extends MixedEntities {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  address: string;

  @Column({ name: 'birth_date', nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  note: string;

  @Column({ length: 13 })
  phone: string;

  @Column({ length: 13, nullable: true })
  mobile: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  fax: string;

  @Column({ nullable: true })
  rc: string;

  @Column({ nullable: true })
  agr: string;

  @Column({ nullable: true })
  ai: string;

  @Column({ nullable: true })
  activity: string;

  @Column({ name: 'legal_form', nullable: true })
  legalForm: string;

  @Column({ name: 'id_fiscal', nullable: true })
  idFiscal: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  ref: string;

  @Column({ name: 'web_page', nullable: true })
  webPage: string;

  @Column({ name: 'img_path', nullable: true })
  imgPath: string;

  @OneToMany(() => Order, (order: Order) => order.client)
  orders: Order[];

  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.client)
  cartItems: CartItem[];

  @OneToMany(() => ShippingAddress, (shippingAddress: ShippingAddress) => shippingAddress.client, {
    cascade: true,
  })
  shippingAddresses: ShippingAddress[];

  @Column({ name: 'town_id' })
  townId: number;

  @OneToOne(() => Town, (town: Town) => town.clientSync)
  town: Town;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @OneToOne(() => User, (user: User) => user.client, {
    nullable: false,
    cascade: ['insert'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
