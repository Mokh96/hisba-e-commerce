import { LabelPathSync } from 'src/common-entities/labelPath.common.entity';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Brand extends LabelPathSync {
  @OneToMany(() => Brand, (brand: Brand) => brand.parent)
  children: Brand[];

  @ManyToOne(() => Brand, (brand: Brand) => brand.children, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Brand;

  @OneToMany(() => Product, (product: Product) => product.brand)
  products: Product[];

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;
}
