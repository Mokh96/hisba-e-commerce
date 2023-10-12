import { Column } from 'typeorm';
import { Label } from './label.common.entity';

export abstract class LabelPath extends Label {
  @Column()
  img_path: string;
}
