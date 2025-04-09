import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { ORDER_ITEM_FIELD_LENGTHS } from 'src/modules/order-items/config/order-items.config';

export class CreateCartItemDto {
  @IsNumber()
  @IsPositive()
  articleId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  offset: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  @Max(ORDER_ITEM_FIELD_LENGTHS.NOTE)
  note: string;

  @IsOptional()
  @IsString()
  @Max(ORDER_ITEM_FIELD_LENGTHS.REF)
  ref: string;
}
