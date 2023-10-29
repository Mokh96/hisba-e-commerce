import { Article } from 'src/articles/entities/article.entity';
import { Option } from 'src/options/entities/option.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity()
export class OptionsValue {
  @PrimaryGeneratedColumn()
  id: number;

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
