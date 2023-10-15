import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rapport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ length: 1000 })
  description: string;
}
