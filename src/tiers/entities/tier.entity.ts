import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tier {
  @PrimaryGeneratedColumn()
  id: number;
}
