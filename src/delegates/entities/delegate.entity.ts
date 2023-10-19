import { Rapport } from 'src/rapports/entities/rapport.entity';
import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Delegate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  mobile: string;

  @Column()
  email: string;

  @Column({ name: 'img_path', nullable: true })
  imgPath: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  note: string;

  @OneToOne(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Track, (track: Track) => track.delegate)
  tracks: Track[];

  @OneToMany(() => Rapport, (rapport: Rapport) => rapport.delegate)
  rapports: Rapport[];
}
