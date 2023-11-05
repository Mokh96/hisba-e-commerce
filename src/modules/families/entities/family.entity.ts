import { LabelPathSync } from 'src/common-entities/labelPath.common.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Family extends LabelPathSync {
  @OneToMany(() => Family, (family: Family) => family.parent)
  children: Family[];

  @ManyToOne(() => Family, (family: Family) => family.children, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Family;

  @OneToMany(() => Product, (product: Product) => product.family)
  products: Product[];

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;
}
