import { SyncEntityCommon } from 'src/common-entities/sync.entity';
import { Tier } from 'src/modules/tiers/entities/tier.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ShippingAddress extends SyncEntityCommon {
  @Column()
  address: string;

  @ManyToOne(() => Tier, (tier: Tier) => tier.shippingAddresses, {
    nullable: false,
  })
  @JoinColumn({ name: 'tier_id' })
  tier: Tier;

  @Column({ name: 'tier_id' })
  tierId: number;
}
