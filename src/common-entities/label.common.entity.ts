import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export abstract class LabelCommon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('label', { unique: true })
  label: string;
}

export abstract class LabelSync extends LabelCommon {
  @Column({ name: 'sync_id', nullable: true })
  @Index('sync_id', { unique: true })
  syncId: number;
}
