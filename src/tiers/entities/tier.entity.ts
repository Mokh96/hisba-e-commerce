import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Tier as TierShape } from 'src/common-entities/tier.common.entity';
import { Order } from 'src/orders/entities/order.entity';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { ShippingAddress } from 'src/shipping-addresses/entities/shipping-address.entity';
import { ProspectiveTier } from 'src/prospective-tiers/entities/prospective-tier.entity';
import { TierType } from 'src/tier-types/entities/tier-type.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Tier extends TierShape {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  ref: string;

  @Column({ name: 'web_page', nullable: true })
  webPage: string;

  @Column({ name: 'img_path', nullable: true })
  imgPath: string;

  @OneToMany(() => Order, (order: Order) => order.tier)
  orders: Order[];

  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.tier)
  cartItems: CartItem[];

  @OneToMany(
    () => ShippingAddress,
    (shippingAddress: ShippingAddress) => shippingAddress.tier,
  )
  shippingAddresses: ShippingAddress[];

  @ManyToOne(() => TierType, (tierType: TierType) => tierType.tiers, {
    nullable: false,
  })
  type: TierType;

  @ManyToOne(() => User, (user: User) => user.createdTiers, { nullable: false })
  creator: User;

  @OneToOne(() => ShippingAddress)
  @JoinColumn()
  defaultShippingAddress: ShippingAddress;

  @OneToOne(() => ProspectiveTier)
  @JoinColumn()
  prospectiveTier: ProspectiveTier;
}
