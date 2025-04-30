import {
  IsOptional,
  IsNumber,
  IsArray,
  MaxLength,
  IsString,
  IsBoolean,
  Min,
  IsInt,
  ArrayMaxSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PRODUCT_FIELD_LENGTHS } from 'src/modules/products/config/products.config';
import { TransformStringToBoolean } from 'src/common/decorators';
import { Product } from 'src/modules/products/entities/product.entity';
import { IntersectionType } from '@nestjs/mapped-types';
import { createFiltersDto } from 'src/common/dtos/base/create-filters.dto';
import { createInFiltersDto } from 'src/common/dtos/base/create-in-filters.dto';
import { createGtDto } from 'src/common/dtos/base/create-filter.dto';
import { createGteDto } from 'src/common/dtos/base/create-gte-filter.dto';
import { createLtDto } from 'src/common/dtos/base/create-lt-filter.dto';
import { createLteDto } from 'src/common/dtos/base/create-lte-filter.dto';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import { createFieldsDto } from 'src/common/dtos/base/create-fields.dto';
import { createSearchDto } from 'src/common/dtos/base/create-search.dto';

class BaseFiltersValidator {
  @IsOptional()
  @MaxLength(PRODUCT_FIELD_LENGTHS.CODE)
  @IsString()
  code?: string;

  @IsOptional()
  @MaxLength(PRODUCT_FIELD_LENGTHS.REF)
  @IsString()
  ref?: string;

  @IsOptional()
  @MaxLength(PRODUCT_FIELD_LENGTHS.LABEL)
  @IsString()
  label?: string;

  @IsOptional()
  @MaxLength(PRODUCT_FIELD_LENGTHS.LABEL2)
  @IsString()
  label2?: string;
}

class FiltersValidator extends BaseFiltersValidator {
  @IsBoolean()
  @IsOptional()
  @TransformStringToBoolean({ allowNull: false })
  isOutStock?: boolean;

  @IsBoolean()
  @IsOptional()
  @TransformStringToBoolean({ allowNull: false })
  isExpired?: boolean;

  @IsBoolean()
  @IsOptional()
  @TransformStringToBoolean({ allowNull: false })
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  @TransformStringToBoolean({ allowNull: false })
  isMultiArticle?: boolean;
}

class SearchValidator extends BaseFiltersValidator {
  @IsOptional()
  @MaxLength(PRODUCT_FIELD_LENGTHS.NOTE)
  @IsString()
  note?: string;

  @IsOptional()
  @MaxLength(PRODUCT_FIELD_LENGTHS.NOTE)
  @IsString()
  description?: string;
}

class NumberFilterValidator {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value) || undefined)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value) || undefined)
  minPrice?: number;
}

class InFiltersValidator {
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  @ArrayMaxSize(100)
  brandIds?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayMaxSize(100)
  categoryIds?: number[];
}

export class ProductFilterDto extends IntersectionType(
  createFieldsDto(Product),
  createSearchDto(SearchValidator),
  createFiltersDto(FiltersValidator),
  createInFiltersDto(InFiltersValidator),
  createGtDto(NumberFilterValidator),
  createGteDto(NumberFilterValidator),
  createLtDto(NumberFilterValidator),
  createLteDto(NumberFilterValidator),
  DateRangeFiltersDto,
) {}
