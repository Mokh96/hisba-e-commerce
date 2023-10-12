import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Delegate {
  @PrimaryGeneratedColumn()
  id: number;
}
