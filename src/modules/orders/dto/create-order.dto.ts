import { ORDER_FIELD_LENGTHS } from 'src/modules/orders/config/orders.config';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from 'src/modules/order-items/dto/create-order-item.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(ORDER_FIELD_LENGTHS.NOTE)
  note?: string;

  @IsOptional()
  @IsString()
  @MaxLength(ORDER_FIELD_LENGTHS.REF)
  ref?: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string; //is optional =>  if (copy from client if not sent)

  @IsInt()
  @IsPositive()
  deliveryTownId: number;

  @IsInt()
  @IsPositive()
  paymentMethodId: number;

  @IsInt()
  @IsPositive()
  statusId: number;

  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  cartItemsIds: number[];

  /*@IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];*/
}
