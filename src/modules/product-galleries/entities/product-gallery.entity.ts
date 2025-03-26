import { GalleryCommon } from 'src/common-entities/gallery.common.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Entity, ManyToOne } from 'typeorm';

/*@Entity()*/
export class ProductGallery extends GalleryCommon {
 /* @ManyToOne(() => Product, (product: Product) => product.gallery, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  product: Product;*/
}
