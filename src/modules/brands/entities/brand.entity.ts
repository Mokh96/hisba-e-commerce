import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { WithImgPath } from 'src/common/entities/img-path.entity';
import { WithLabel } from 'src/common/entities/label.entity';
import { WithEntityAttributeUtils } from 'src/common/entities/entity-attribute.entity';
import { ARTICLE_FIELD_LENGTHS } from 'src/modules/articles/config/articles.config';
import { BRAND_FIELD_LENGTHS } from 'src/modules/brands/config/brand.config';

const MixedEntities = WithTimestamp(WithSyncId(WithImgPath(WithEntityAttributeUtils(BaseEntity))));

@Entity()
export class Brand extends MixedEntities {
  @Index('label', { unique: true })
  @Column({length: BRAND_FIELD_LENGTHS.LABEL })
  label: string;

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
