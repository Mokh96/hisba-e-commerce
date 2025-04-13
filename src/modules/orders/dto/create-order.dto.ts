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
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from 'src/modules/order-items/dto/create-order-item.dto';
import { OneOfFields } from 'src/common/decorators/validators/one-of-fields.decorator';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';

@OneOfFields(['cartItemsIds', 'orderItems'], {
  message: 'You must provide at least one of cartItemsIds or orderItems.',
})
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
  deliveryAddress: string; //is optional => if (copy from a client if not sent)

  @IsInt()
  @IsPositive()
  deliveryTownId: number;

  @IsInt()
  @IsPositive()
  paymentMethodId: number;

  @IsInt()
  @IsPositive()
  statusId: OrderStatus;

  @ValidateIf((o) => o.orderItems?.length === 0 && o.cartItemsIds?.length > 0)
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  cartItemsIds?: CartItem['id'][];

  @ValidateIf((o) => o.cartItemsIds?.length === 0 && o.orderItems?.length > 0)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  orderItems?: CreateOrderItemDto[];
}
