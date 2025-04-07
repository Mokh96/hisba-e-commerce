import { Column, Entity, OneToMany } from 'typeorm';
import { Town } from 'src/modules/towns/entities/town.entity';

@Entity()
export class Wilaya {
  @Column({ primary: true })
  id: number;

  @Column()
  label: string;

  @OneToMany(() => Town, (town: Town) => town.wilaya)
  towns: Town[];
}
