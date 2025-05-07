import { Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

//todo : remove this file
export abstract class ClientCommon {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}

export class ClientSync extends ClientCommon {
  @Column({ name: 'sync_id', nullable: true })
  @Index('sync_id', { unique: true })
  syncId: number;
}
