import { Column, Index } from 'typeorm';
import { MixinConstructor } from 'src/common/types/entities.types';
import { MAX_LABEL_LENGTH } from 'src/common/constants';

export function WithLabel<TBase extends MixinConstructor>(Base: TBase) {
  class LabelEntity extends Base {
    @Column({ type: 'varchar', length: MAX_LABEL_LENGTH })
    @Index('label', { unique: true })
    label: string;
  }

  return LabelEntity;
}
