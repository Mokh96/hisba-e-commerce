import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { WithLabel } from 'src/common/entities/label.entity';
import { WithImgPath } from 'src/common/entities/img-path.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';

const CategoryBase = WithTimestamp(WithSyncId(WithLabel(WithImgPath(BaseEntity))));

@Entity()
export class Category extends CategoryBase {
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
