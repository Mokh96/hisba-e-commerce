import { LabelPath } from 'src/common-entities/labelPath.common.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Brand extends LabelPath {
  @OneToMany(() => Brand, (brand: Brand) => brand.parent)
  children: Brand[];

  @ManyToOne(() => Brand, (brand: Brand) => brand.children, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  parent: Brand;

  
}
