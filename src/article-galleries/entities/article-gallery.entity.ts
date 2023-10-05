import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArticleGallery {
  @PrimaryGeneratedColumn()
  id: number;
}
