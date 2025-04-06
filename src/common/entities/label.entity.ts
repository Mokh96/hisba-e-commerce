import { Column, Index } from 'typeorm';
import { MixinConstructor } from 'src/common/types/entities.types';

export function WithLabel<TBase extends MixinConstructor>(Base: TBase) {
  class LabelEntity extends Base {
    @Column()
    @Index('label', { unique: true })
    label: string;
  }

  return LabelEntity;
}
