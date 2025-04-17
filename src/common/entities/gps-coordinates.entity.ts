import { Column } from 'typeorm';
import { MixinConstructor } from 'src/common/types/entities.types';

export function WithGpsCoordinates<TBase extends MixinConstructor>(Base: TBase) {
  class GpsEntity extends Base {
    @Column({
      name: 'latitude',
      type: 'decimal',
      precision: 10,
      scale: 8,
      nullable: true,
    })
    latitude: number;

    @Column({
      name: 'longitude',
      type: 'decimal',
      precision: 11,
      scale: 8,
      nullable: true,
    })
    longitude: number;
  }

  return GpsEntity;
}
