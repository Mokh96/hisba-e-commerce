import { Label } from 'src/common-entities/label.common.entity';
import { Tier } from 'src/tiers/entities/tier.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class TierType extends Label {
  @OneToMany(() => Tier, (tier: Tier) => tier.type)
  tiers: Tier[];
}
