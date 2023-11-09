import { Column, Index } from 'typeorm';
import { LabelCommon } from './label.common.entity';

export abstract class LabelPathCommon extends LabelCommon {
  @Column({ nullable: true, name: 'img_path' })
  imgPath: string;
}

export abstract class LabelPathSync extends LabelPathCommon {
  @Column({ name: 'sync_id', nullable: true })
  @Index('sync_id', { unique: true })
  syncId: number;
}
