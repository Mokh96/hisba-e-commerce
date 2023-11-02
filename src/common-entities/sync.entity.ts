import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export class SyncEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sync_id', nullable: true })
  @Index('sync_id', { unique: true })
  syncId: number;
}
