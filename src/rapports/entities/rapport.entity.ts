import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rapport {
  @PrimaryGeneratedColumn()
  id: number;
}
