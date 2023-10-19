import { Tier } from 'src/tiers/entities/tier.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @ManyToOne(() => Tier, (tier: Tier) => tier.shippingAddresses, {
    nullable: false,
  })
  tier: Tier;
}
