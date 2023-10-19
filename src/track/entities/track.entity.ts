import { Delegate } from 'src/delegates/entities/delegate.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lat: string;

  @Column()
  lng: string;

  @Column()
  action: string;

  @Column({ name: 'action_info', length: 1000, nullable: true })
  actionInfo: string;

  @ManyToOne(() => Delegate, (delegate: Delegate) => delegate.tracks, {
    nullable: false,
  })
  delegate: Delegate;
}
