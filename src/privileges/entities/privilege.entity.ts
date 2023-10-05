import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Privilege {
  @PrimaryGeneratedColumn()
  id: number;
}
