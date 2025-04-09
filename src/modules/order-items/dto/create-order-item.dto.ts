import { IsOptional, IsString, Max } from 'class-validator';
import { ORDER_ITEM_FIELD_LENGTHS } from 'src/modules/order-items/config/order-items.config';

export class CreateOrderItemDto {
  @IsOptional()
  @IsString()
  @Max(ORDER_ITEM_FIELD_LENGTHS.ARTICLE_REF)
  articleRef: string | null;
}
