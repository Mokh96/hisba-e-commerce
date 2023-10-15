import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Delegate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  mobile: string;

  @Column()
  email: string;

  @Column({ name: 'img_path', nullable: true })
  imgPath: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  note: string;
}
