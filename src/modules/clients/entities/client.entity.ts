import { ClientSync } from 'src/common-entities/client.common.entity';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { ShippingAddress } from 'src/modules/shipping-addresses/entities/shipping-address.entity';
import { Town } from 'src/modules/system-entities/entities/town.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Client extends ClientSync {
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
