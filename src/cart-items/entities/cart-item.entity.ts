import { OrderItem } from 'src/common-entities/order-item.common.entity';
import { Lot } from 'src/lots/entities/lot.entity';
import { Tier } from 'src/tiers/entities/tier.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class CartItem extends OrderItem {
  @ManyToOne(() => Lot, (lot: Lot) => lot.cartItems, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  lot: Lot;

  @ManyToOne(() => Tier, (tier: Tier) => tier.cartItems, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  tier: Tier;
}
