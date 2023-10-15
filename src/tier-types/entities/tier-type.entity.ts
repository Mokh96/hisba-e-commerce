import { Label } from 'src/common-entities/label.common.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TierType extends Label {}
