import { Delegate } from 'src/delegates/entities/delegate.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Rapport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ length: 1000 })
  description: string;

  @ManyToOne(() => Delegate, (delegate: Delegate) => delegate.rapports, {
    nullable: false,
  })
  delegate: Delegate;
}
