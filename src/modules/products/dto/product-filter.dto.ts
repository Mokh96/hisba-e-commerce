import {
  IsOptional,
  IsNumber,
  IsArray,
  MaxLength,
  IsString,
  IsBoolean,
  IsObject,
  ValidateNested,
  Min,
  IsInt,
  ArrayMaxSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PRODUCT_FIELD_LENGTHS } from 'src/modules/products/config/products.config';
import { DateRangeDto } from 'src/common/dtos/filters/date-rang.dto';
import { TransformStringToBoolean } from 'src/common/decorators';
import { IsValidFieldFor } from 'src/common/decorators/validators/validate-fields.decorator';
import { Product } from 'src/modules/products/entities/product.entity';

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
  brandId?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayMaxSize(100)
  categoryId?: number[];
}

export class ProductFilterDto {
  @IsOptional()
  @IsObject()
  @Type(() => SearchValidator) // Create a class for search validation
  @ValidateNested({ each: true })
  search?: Partial<Record<keyof SearchValidator, string>> = {};

  @IsOptional()
  @Type(() => FiltersValidator)
  @ValidateNested({ each: true })
  filters?: FiltersValidator = {};

  @IsOptional()
  @Type(() => InFiltersValidator)
  @ValidateNested({ each: true })
  in?: InFiltersValidator;

  // Greater-than filters for fields like 'price'
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => NumberFilterValidator)
  gt?: NumberFilterValidator;

  // Greater-than or equal filters for fields like 'price'
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => NumberFilterValidator)
  gte?: NumberFilterValidator;

  // Less-than filters for fields like 'price'
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => NumberFilterValidator)
  lt?: NumberFilterValidator;

  //Less-than or equal filters for fields like 'price'
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => NumberFilterValidator)
  lte?: NumberFilterValidator;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  createdAt?: DateRangeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  updatedAt?: DateRangeDto;

  @IsOptional()
  @IsArray()
  @IsValidFieldFor(Product)
  fields?: (keyof Product)[];
}
