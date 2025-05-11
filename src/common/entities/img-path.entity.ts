import { Column } from 'typeorm';
import { MixinConstructor } from 'src/common/types/entities.types';

export function WithImgPath<TBase extends MixinConstructor>(Base: TBase) {
  class ImgPathEntity extends Base {
    @Column({ name: 'img_path', nullable: true })
    imgPath: string | null;
  }

  return ImgPathEntity;
}
