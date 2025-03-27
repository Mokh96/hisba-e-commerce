import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Town } from 'src/modules/towns/entities/town.entity';

@Entity()
export class Wilaya extends BaseEntity {
  @Column()
  label: string;

  @OneToMany(() => Town, (town: Town) => town.wilaya)
  towns: Town[];
}
