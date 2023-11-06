import { LabelPathSync } from 'src/common-entities/labelPath.common.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category extends LabelPathSync {
  @OneToMany(() => Category, (category: Category) => category.parent)
  children: Category[];

  @ManyToOne(() => Category, (category: Category) => category.children, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Product, (product: Product) => product.category)
  products: Product[];

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;
}
