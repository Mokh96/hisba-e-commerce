import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { WithLabel } from 'src/common/entities/label.entity';
import { WithImgPath } from 'src/common/entities/img-path.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';

const FamilyBase = WithTimestamp(WithSyncId(WithLabel(WithImgPath(BaseEntity))));

@Entity()
export class Family extends FamilyBase {
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
