import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'img_path', nullable: true })
  imgPath: boolean;

  @Column()
  code: string;

  @Column()
  reference: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  label2: string;

  @Column()
  note: string;

  @Column()
  description: string;

  @Column({ name: 'is_out_stock', default: false })
  isOutStock: boolean;

  @Column({ name: 'is_expired', default: true })
  isExpired: boolean;

  @Column({ name: 'is_multi_article', default: false })
  isMultiArticle: boolean;
}
