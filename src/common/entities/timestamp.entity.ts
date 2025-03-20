import { Column } from 'typeorm';
import { MixinConstructor  } from './entities.types';

interface TimeStampProperties {
  createdAt: Date;
  updatedAt: Date;
}


export function WithTimestamp<TBase extends MixinConstructor>(Base: TBase) {
  class TimeStampEntity extends Base implements TimeStampProperties {
    @Column({
      name: 'created_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({
      name: 'updated_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
  }

  return TimeStampEntity;
}
