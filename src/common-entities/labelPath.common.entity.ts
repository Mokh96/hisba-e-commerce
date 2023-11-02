import { Column, Index } from 'typeorm';
import { Label } from './label.common.entity';

export abstract class LabelPath extends Label {
  @Column({ nullable: true, name: 'img_path' })
  imgPath: string;
}

export abstract class LabelPathSync extends LabelPath {
  @Column({ name: 'sync_id', nullable: true })
  @Index('sync_id', { unique: true })
  syncId: number;
}
