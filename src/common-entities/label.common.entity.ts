import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Label {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('label', { unique: true })
  label: string;
}
