import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { BaseCreateOrder, CreateOrderDto } from './create-order.dto';
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
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from 'src/modules/order-items/dto/create-order-item.dto';
import { ORDER_ITEM_FIELD_LENGTHS } from 'src/modules/order-items/config/order-items.config';
import { UpdateOrderItemDto } from 'src/modules/order-items/dto/update-order-item.dto';

class OrderItemDto extends OmitType(UpdateOrderItemDto, ['articleId']) {
//class OrderItemDto extends UpdateOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number;
}

/**
 * used to update existing order items
 * - Each item **must include an `id`** to match an existing record.
 * - If an existing item is **not included** in this list, it will be considered **deleted**.
 * - All fields are editable **except `articleId`**, which is immutable for existing items.
 * - The `articleId` field is omitted from this DTO to prevent accidental updates.
 * - The `articleId` field is immutable for existing items.
 * */
export class OrderItemsDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems?: OrderItemDto[]; //updated /deleted order items
}

class ToCreateOrderItemDto extends CreateOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  unitePriceHt: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  unitePriceTtc: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discount: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(ORDER_ITEM_FIELD_LENGTHS.ARTICLE_LABEL)
  articleLabel: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(ORDER_ITEM_FIELD_LENGTHS.ARTICLE_REF)
  articleRef: string;
}

export class UpdateOrderDto extends IntersectionType(PartialType(BaseCreateOrder)) {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  syncId: number; // The ID from the desktop application (external source of truth)

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountHt: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  netAmountTtc: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  netToPay: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalTva: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stampDuty: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems?: OrderItemDto[]; //updated /deleted order items

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToCreateOrderItemDto)
  /**
   * Existing items to update.
   * - Each item **must include an `id`** (used to match existing records).
   * - If an existing item is **not included** in this list, it will be considered **deleted**.
   * - Only basic fields like quantity, offset, and note will be updated.
   */
  newOrderItems?: ToCreateOrderItemDto[];
}
