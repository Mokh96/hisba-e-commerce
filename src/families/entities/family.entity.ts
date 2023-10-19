import { LabelPath } from 'src/common-entities/labelPath.common.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Family extends LabelPath {
  @OneToMany(() => Family, (family: Family) => family.parent)
  children: Family[];

  @ManyToOne(() => Family, (family: Family) => family.children, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  parent: Family;

  @OneToMany(() => Product, (product: Product) => product.family)
  products: Product[];
}
