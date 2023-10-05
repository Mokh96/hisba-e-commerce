import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;
}
