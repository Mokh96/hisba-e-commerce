import { LabelPath } from 'src/common-entities/labelPath.common.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category extends LabelPath {
  @OneToMany(() => Category, (category: Category) => category.parent)
  children: Category[];

  @ManyToOne(() => Category, (category: Category) => category.children, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  parent: Category;

  @OneToMany(() => Product, (product: Product) => product.category)
  products: Product[];
}
