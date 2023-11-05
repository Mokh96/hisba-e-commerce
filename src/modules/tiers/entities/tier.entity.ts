import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { TierSync } from 'src/common-entities/tier.common.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { ShippingAddress } from 'src/modules/shipping-addresses/entities/shipping-address.entity';
import { ProspectiveTier } from 'src/modules/prospective-tiers/entities/prospective-tier.entity';
import { TierType } from 'src/modules/tier-types/entities/tier-type.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Tier extends TierSync {
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
