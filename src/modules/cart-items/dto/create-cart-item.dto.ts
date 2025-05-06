import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ORDER_ITEM_FIELD_LENGTHS } from 'src/modules/order-items/config/order-items.config';

export class CreateCartItemDto {
  @IsInt()
  @IsPositive()
  articleId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  offset: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(ORDER_ITEM_FIELD_LENGTHS.NOTE)
  note: string;
}
