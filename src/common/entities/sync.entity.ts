import { Column, Index } from 'typeorm';
import { MixinConstructor } from '../types/entities.types';

interface SyncId {
  syncId: number;
}

export function WithSyncId<TBase extends MixinConstructor>(Base: TBase) {
  class SyncIdEntity extends Base implements SyncId {
    @Column({ name: 'sync_id', nullable: true })
    @Index('sync_id', { unique: true })
    syncId: number | null;
  }

  return SyncIdEntity;
}
