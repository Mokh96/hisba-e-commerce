import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProspectiveTier {
  @PrimaryGeneratedColumn()
  id: number;
}
