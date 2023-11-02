import { SyncEntity } from 'src/common-entities/sync.entity';
import { Tier } from 'src/tiers/entities/tier.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class ShippingAddress extends SyncEntity {
  @Column()
  address: string;

  @ManyToOne(() => Tier, (tier: Tier) => tier.shippingAddresses, {
    nullable: false,
  })
  tier: Tier;
}
