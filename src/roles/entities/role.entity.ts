import { Label } from 'src/common-entities/label.common.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class Role extends Label {
  @OneToMany(() => User, (user: User) => user.role)
  users: User[];
}
