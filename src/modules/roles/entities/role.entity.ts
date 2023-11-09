import { LabelCommon } from 'src/common-entities/label.common.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class Role extends LabelCommon {
  @OneToMany(() => User, (user: User) => user.role)
  users: User[];
}
