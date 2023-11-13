import { TierCommon } from 'src/common-entities/tier.common.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class ProspectiveTier extends TierCommon {
  @ManyToOne(() => User, (user: User) => user.createdProspectiveTiers, {
    nullable: false,
  })
  creator: User;
}
