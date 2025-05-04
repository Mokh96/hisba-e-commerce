import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { WithLabel } from 'src/common/entities/label.entity';
import { WithImgPath } from 'src/common/entities/img-path.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { WithEntityAttributeUtils } from 'src/common/entities/entity-attribute.entity';

const MixedEntities = WithTimestamp(WithSyncId(WithImgPath(WithEntityAttributeUtils(BaseEntity))));

@Entity()
export class Category extends MixedEntities {
  @OneToMany(() => Category, (category: Category) => category.parent)
  children: Category[];

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ManyToOne(() => Category, (category: Category) => category.children, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Product, (product: Product) => product.category)
  products: Product[];
}
