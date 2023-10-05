import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductGallery {
  @PrimaryGeneratedColumn()
  id: number;
}
