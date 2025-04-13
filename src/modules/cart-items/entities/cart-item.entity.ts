import { OrderItemCommon } from 'src/common-entities/order-item.common.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

@Entity()
export class CartItem extends OrderItemCommon {
  @Column({ name: 'article_id' , type: 'int' })
  articleId: number;

  @Column({ name: 'client_id' , type: 'int' })
  clientId: number;

  @ManyToOne(() => Article, (article: Article) => article.cartItems, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @ManyToOne(() => Client, (client: Client) => client.cartItems, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
