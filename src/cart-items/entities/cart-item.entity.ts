import { OrderItem } from 'src/common-entities/order-item.common.entity';
import { Entity } from 'typeorm';

@Entity()
export class CartItem extends OrderItem {}
