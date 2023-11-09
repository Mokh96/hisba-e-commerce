import { LabelCommon } from 'src/common-entities/label.common.entity';
import { Tier } from 'src/modules/tiers/entities/tier.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class TierType extends LabelCommon {
  @OneToMany(() => Tier, (tier: Tier) => tier.type)
  tiers: Tier[];
}
