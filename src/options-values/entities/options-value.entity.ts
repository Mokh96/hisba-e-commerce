import { Article } from 'src/articles/entities/article.entity';
import { Option } from 'src/options/entities/option.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class OptionsValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(() => Option, (option: Option) => option.values, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  option: Option;

  @ManyToMany(() => Article, (article: Article) => article.optionValues)
  articles: Article[];
}
