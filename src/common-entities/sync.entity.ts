import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export class SyncEntityCommon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sync_id', nullable: true })
  @Index('sync_id', { unique: true })
  syncId: number;
}
