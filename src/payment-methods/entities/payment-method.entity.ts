import { Label } from 'src/common-entities/label.common.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentMethod extends Label {
  @Column({ name: 'is_stamp', default: false })
  isStamp: boolean;
}
