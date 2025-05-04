import { IsIn, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength, Min } from 'class-validator';
import { PRODUCT_FIELD_LENGTHS } from 'src/modules/products/config/products.config';
import { ORDER_FIELD_LENGTHS } from 'src/modules/orders/config/orders.config';
import { IntersectionType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { PaymentMethod } from 'src/modules/payment-methods/enums/payment.method';
import { createFieldsDto } from 'src/common/dtos/base/create-fields.dto';
import { Product } from 'src/modules/products/entities/product.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { createSearchDto } from 'src/common/dtos/base/create-search.dto';
import { createFiltersDto } from 'src/common/dtos/base/create-filters.dto';
import { createInFiltersDto } from 'src/common/dtos/base/create-in-filters.dto';
import { createGtDto } from 'src/common/dtos/base/create-filter.dto';
import { createGteDto } from 'src/common/dtos/base/create-gte-filter.dto';
import { createLtDto } from 'src/common/dtos/base/create-lt-filter.dto';
import { createLteDto } from 'src/common/dtos/base/create-lte-filter.dto';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import { createDateRangeFiltersDto } from 'src/common/dtos/base/create-date-range-filters-dto';

class CommonSearchAndFiltersValidator {
  @IsOptional()
  @MaxLength(ORDER_FIELD_LENGTHS.REF)
  @IsString()
  ref?: string;

  @IsOptional()
  @MaxLength(ORDER_FIELD_LENGTHS.CLIENT_FIRST_NAME)
  @IsString()
  clientFirstName?: string;

  @IsOptional()
  @MaxLength(ORDER_FIELD_LENGTHS.CLIENT_LAST_NAME)
  @IsString()
  clientLastName?: string;

  @IsOptional()
  @MaxLength(ORDER_FIELD_LENGTHS.CLIENT_PHONE)
  @IsString()
  clientPhone?: string;

  @IsOptional()
  @MaxLength(ORDER_FIELD_LENGTHS.CLIENT_MOBILE)
  @IsString()
  clientMobile?: string;

  @IsOptional()
  @MaxLength(ORDER_FIELD_LENGTHS.CLIENT_FAX)
  @IsString()
  clientFax?: string;

  @IsOptional()
  @MaxLength(ORDER_FIELD_LENGTHS.DELIVERY_ADDRESS)
  @IsString()
  deliveryAddress?: string;
}

class NumberFilterValidator {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value) || undefined)
  amountHt?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value) || undefined)
  netAmountTtc?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value) || undefined)
  netToPay?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value) || undefined)
  totalTva?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value) || undefined)
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => Number(value) || undefined)
  discountPercentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value) || undefined)
  stampDuty?: number;
}

class FiltersValidator extends IntersectionType(CommonSearchAndFiltersValidator, NumberFilterValidator) {
  @IsOptional()
  @IsString()
  @IsIn(Object.values(OrderStatus))
  statusId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  clientId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  syncId?: number;

  @IsOptional()
  @IsIn(Object.values(PaymentMethod))
  paymentMethodId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  deliveryTownId?: number;
}

class SearchValidator extends CommonSearchAndFiltersValidator {
  @IsOptional()
  @MaxLength(ORDER_FIELD_LENGTHS.NOTE)
  @IsString()
  note?: string;
}

class InFiltersValidator {
  @IsOptional()
  @IsString()
  @IsIn(Object.values(OrderStatus))
  statusId?: OrderStatus[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  clientId?: number[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  syncId?: number[];

  @IsOptional()
  @IsIn(Object.values(PaymentMethod))
  paymentMethodId?: PaymentMethod[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  deliveryTownId?: number[];
}

export class OrderFilterDto extends IntersectionType(
  createFieldsDto(Order),
  createSearchDto(SearchValidator),
  createFiltersDto(FiltersValidator),
  createInFiltersDto(InFiltersValidator),
  createGtDto(NumberFilterValidator),
  createGteDto(NumberFilterValidator),
  createLtDto(NumberFilterValidator),
  createLteDto(NumberFilterValidator),
  createDateRangeFiltersDto(DateRangeFiltersDto),
) {}
