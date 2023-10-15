import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Tier as TierShape } from 'src/common-entities/tier.common.entity';

@Entity()
export class Tier extends TierShape {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  reference: string;

  @Column({ name: 'web_page', nullable: true })
  webPage: string;

  @Column({ name: 'img_path', nullable: true })
  imgPath: string;
}
