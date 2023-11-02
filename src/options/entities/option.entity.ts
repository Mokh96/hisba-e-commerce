import { LabelSync } from 'src/common-entities/label.common.entity';
import { OptionsValue } from 'src/options-values/entities/options-value.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class Option extends LabelSync {
  @OneToMany(() => OptionsValue, (value: OptionsValue) => value.option)
  values: OptionsValue[];
}
