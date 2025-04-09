import { GalleryCommon } from 'src/common-entities/gallery.common.entity';
import { Article } from 'src/modules/articles/entities/article.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity()
export class ProductGallery extends GalleryCommon {
  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (product: Product) => product.gallery, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
