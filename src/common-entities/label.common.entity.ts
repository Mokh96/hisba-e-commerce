import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Label {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;
}
