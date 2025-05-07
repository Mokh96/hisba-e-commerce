import { CreateOrderItemDto } from 'src/modules/order-items/dto/create-order-item.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemsDto } from 'src/modules/orders/dto/update-order.dto';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { BaseCreateOrder } from 'src/modules/orders/dto/create-order.dto';

class ToCreateOrderItemDto extends CreateOrderItemDto {}

export class UpdateOrderByClientDto extends IntersectionType(PartialType(BaseCreateOrder), OrderItemsDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToCreateOrderItemDto)
  newOrderItems?: ToCreateOrderItemDto[];
}
