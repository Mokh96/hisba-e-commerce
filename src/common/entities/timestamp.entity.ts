import { Column } from 'typeorm';
import { MixinConstructor } from '../types/entities.types';
import { Filterable, FilterType } from 'src/common/decorators/metadata/filterable.decorator';

interface TimeStampProperties {
  createdAt: Date;
  updatedAt: Date;
}

export function WithTimestamp<TBase extends MixinConstructor>(Base: TBase) {
  class TimeStampEntity extends Base implements TimeStampProperties {
    @Filterable(FilterType.DATE_FROM , FilterType.DATE_TO)
    @Column({
      name: 'created_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Filterable(FilterType.DATE_FROM , FilterType.DATE_TO)
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
