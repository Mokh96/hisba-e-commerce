import { ORDER_FIELD_LENGTHS } from 'src/modules/orders/config/orders.config';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from 'src/modules/order-items/dto/create-order-item.dto';
import { OneOfFields } from 'src/common/decorators/validators/one-of-fields.decorator';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { OrderStatus } from 'src/modules/orders/enums/order-status.enum';
import { PaymentMethod } from 'src/modules/payment-methods/enums/payment.method';
import { gpsCoordinatesDto } from 'src/common/dtos/gps-coordinates/gps-coordinates.dto';

export class BaseCreateOrder extends gpsCoordinatesDto {
  @IsOptional()
  @IsString()
  @MaxLength(ORDER_FIELD_LENGTHS.NOTE)
  note?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(ORDER_FIELD_LENGTHS.DELIVERY_ADDRESS)
  deliveryAddress: string;

  @IsInt()
  @IsPositive()
  deliveryTownId: number;

  @IsInt()
  @IsPositive()
  @IsEnum(OrderStatus, { message: 'paymentMethodId must be a valid paymentMethodId value.' })
  paymentMethodId: PaymentMethod;

  @IsNotEmpty()
  @IsString()
  @MaxLength(ORDER_FIELD_LENGTHS.CLIENT_FULL_NAME)
  clientFullName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(ORDER_FIELD_LENGTHS.CLIENT_PHONE)
  clientPhone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(ORDER_FIELD_LENGTHS.CLIENT_MOBILE)
  clientMobile: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(ORDER_FIELD_LENGTHS.CLIENT_FAX)
  clientFax: string;
}

@OneOfFields(['cartItemsIds', 'orderItems'], {
  message: 'You must provide at least one of cartItemsIds or orderItems.',//todo: use i18n
})
export class CreateOrderDto extends BaseCreateOrder {
  @ValidateIf((o: CreateOrderDto) => o.orderItems?.length === 0 || o.cartItemsIds?.length > 0)
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  cartItemsIds?: CartItem['id'][];

  @ValidateIf((o: CreateOrderDto) => o.cartItemsIds?.length === 0 || o.orderItems?.length > 0)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  orderItems?: CreateOrderItemDto[];
}
