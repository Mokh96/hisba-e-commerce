import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TierType {
  @PrimaryGeneratedColumn()
  id: number;
}
