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
  IsObject,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PRODUCT_FIELD_LENGTHS } from 'src/modules/products/config/products.config';
import { TransformStringToBoolean } from 'src/common/decorators';
import { Product } from 'src/modules/products/entities/product.entity';
import { IntersectionType } from '@nestjs/mapped-types';
import { createFiltersDto } from 'src/common/dtos/base/create-filters.dto';
import { createInFiltersDto } from 'src/common/dtos/base/create-in-filters.dto';
import { createGtDto } from 'src/common/dtos/base/create-gt-filter.dto';
import { createGteDto } from 'src/common/dtos/base/create-gte-filter.dto';
import { createLtDto } from 'src/common/dtos/base/create-lt-filter.dto';
import { createLteDto } from 'src/common/dtos/base/create-lte-filter.dto';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import { createFieldsDto } from 'src/common/dtos/base/create-fields.dto';
import { createSearchDto } from 'src/common/dtos/base/create-search.dto';
import { createDateRangeFiltersDto } from 'src/common/dtos/base/create-date-range-filters.dto';
import { createPaginationDto } from 'src/common/dtos/base/create-pagination/create-pagination.dto';
import { createSwFilterDto } from 'src/common/dtos/base/create-sw-filter.dto';
import { createEwFilterDto } from 'src/common/dtos/base/create-ew-filter.dto';

class SearchAndFiltersValidator {
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

class FiltersValidator extends IntersectionType(SearchAndFiltersValidator, NumberFilterValidator) {
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

class SearchValidator extends SearchAndFiltersValidator {
  @IsOptional()
  @MaxLength(PRODUCT_FIELD_LENGTHS.NOTE)
  @IsString()
  note?: string;

  @IsOptional()
  @MaxLength(PRODUCT_FIELD_LENGTHS.NOTE)
  @IsString()
  description?: string;
}

class StartsWithValidator extends SearchAndFiltersValidator {}

class EndsWithValidator extends SearchAndFiltersValidator {}

class InFiltersValidator {
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayMaxSize(100)
  brandId?: number[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayMaxSize(100)
  categoryId?: number[];
}

//const paginationDto = createPaginationDto<Pick<Product, 'id' | 'maxPrice'>>(['id', 'maxPrice']);

export class ProductFilterDto extends IntersectionType(
  createFieldsDto(Product),
  createPaginationDto<Pick<Product, 'id' | 'maxPrice'>>(['id', 'maxPrice']),
  createSwFilterDto(StartsWithValidator),
  createEwFilterDto(EndsWithValidator),
  createSearchDto(SearchValidator),
  createFiltersDto(FiltersValidator),
  createInFiltersDto(InFiltersValidator),
  createGtDto(NumberFilterValidator),
  createGteDto(NumberFilterValidator),
  createLtDto(NumberFilterValidator),
  createLteDto(NumberFilterValidator),
  //createNotInDto(InFiltersValidator),//no need for now
  createDateRangeFiltersDto(DateRangeFiltersDto),
) {}
