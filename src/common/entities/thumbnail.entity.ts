import { MixinConstructor } from 'src/common/types/entities.types';
import { Column } from 'typeorm';

export function WithThumbnail<TBase extends MixinConstructor>(Base: TBase) {
  class ThumbnailEntity extends Base {
    @Column({ name: 'thumbnail', nullable: true })
    thumbnail: string | null;
  }

  return ThumbnailEntity;
}
