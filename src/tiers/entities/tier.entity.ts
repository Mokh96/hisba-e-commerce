import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  reference: string;

  @Column()
  full_name: string;

  @Column()
  address: string;

  @Column()
  birth_date: string;

  @Column()
  note: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  fax: string;

  @Column()
  mobile: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'web_page', nullable: true })
  webPage: string;
}
