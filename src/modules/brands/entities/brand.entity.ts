import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { WithImgPath } from 'src/common/entities/img-path.entity';
import { WithLabel } from 'src/common/entities/label.entity';

const BrandBase = WithTimestamp(WithSyncId(WithLabel(WithImgPath(BaseEntity))));

@Entity()
export class Brand extends BrandBase {
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
