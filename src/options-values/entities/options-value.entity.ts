import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OptionsValue {
  @PrimaryGeneratedColumn()
  id: number;
}
