import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderHistory {
  @PrimaryGeneratedColumn()
  id: number;
}
