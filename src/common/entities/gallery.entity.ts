import { Column } from 'typeorm';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';

export abstract class Gallery extends WithTimestamp(BaseEntity) {
  @Column()
  path: string;
}
