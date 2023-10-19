import { Tier } from 'src/common-entities/tier.common.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class ProspectiveTier extends Tier {
  @ManyToOne(() => User, (user: User) => user.createdProspectiveTiers, {
    nullable: false,
  })
  creator: User;
}
