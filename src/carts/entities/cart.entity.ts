import { Order } from 'src/common-entities/order.common.entity';
import { Entity } from 'typeorm';

@Entity()
export class Cart extends Order {}
