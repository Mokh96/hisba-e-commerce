import { OrderItemCommon } from 'src/common-entities/order-item.common.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

@Entity()
export class CartItem extends OrderItemCommon {
  @ManyToOne(() => Article, (article: Article) => article.cartItems, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  article: Article;

  @ManyToOne(() => Client, (client: Client) => client.cartItems, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  client: Client;
}
