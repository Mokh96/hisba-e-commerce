import { Article } from 'src/articles/entities/article.entity';
import { SyncEntity } from 'src/common-entities/sync.entity';
import { Option } from 'src/options/entities/option.entity';
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity()
export class OptionsValue extends SyncEntity {
  @Column()
  @Index('value', { unique: true })
  value: string;

  @ManyToOne(() => Option, (option: Option) => option.values, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'option_id' })
  option: Option;

  @Column({ name: 'option_id' })
  optionId: number;

  @ManyToMany(() => Article, (article: Article) => article.optionValues)
  articles: Article[];
}
