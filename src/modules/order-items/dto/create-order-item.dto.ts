import { IsOptional, IsString, Max } from 'class-validator';
import { ORDER_ITEM_FIELD_LENGTHS } from 'src/modules/order-items/config/order-items.config';
import { CreateCartItemDto } from 'src/modules/cart-items/dto/create-cart-item.dto';

export class CreateOrderItemDto extends CreateCartItemDto {}
