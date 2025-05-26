import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { ARTICLE_FIELD_LENGTHS } from 'src/modules/articles/config/articles.config';
import { IntersectionType } from '@nestjs/mapped-types';
import { createFieldsDto } from 'src/common/dtos/base/create-fields.dto';
import { createSearchDto } from 'src/common/dtos/base/create-search.dto';
import { createFiltersDto } from 'src/common/dtos/base/create-filters.dto';
import { createInFiltersDto } from 'src/common/dtos/base/create-in-filters.dto';
import { createDateRangeFiltersDto } from 'src/common/dtos/base/create-date-range-filters.dto';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Brand } from 'src/modules/brands/entities/brand.entity';
import { Transform } from 'class-transformer';
import { parseNumberOrNull } from 'src/common/utils/transforms/transforms';
import IsNullablePositiveIntArray from 'src/common/decorators/validators/is-nullable-positive-int-array.dto';
import { createPaginationDto } from 'src/common/dtos/base/create-pagination/create-pagination.dto';
import { Product } from 'src/modules/products/entities/product.entity';

export class FiltersValidator {
  @IsOptional()
  @Transform(({ obj, key }) => parseNumberOrNull(obj[key]))
  @IsInt()
  syncId?: number;

  @IsOptional()
  @Transform(({ obj, key }) => parseNumberOrNull(obj[key]))
  @IsInt()
  parentId?: number | null;
}

export class SearchValidator {
  @IsOptional()
  @MaxLength(ARTICLE_FIELD_LENGTHS.LABEL)
  @IsString()
  label?: string;
}

export class InFiltersValidator {
  @IsOptional()
  @Transform((params) => params.value.map(parseNumberOrNull))
  @IsNullablePositiveIntArray()
  parentId?: number[];

  @IsOptional()
  @Transform((params) => params.value.map(parseNumberOrNull))
  @IsNullablePositiveIntArray()
  syncId?: number[];
}

export class BrandFilterDto extends IntersectionType(
  createFieldsDto(Brand),
  createPaginationDto<Pick<Brand, 'id'>>({ sortFields: ['id'] }),
  createSearchDto(SearchValidator),
  createFiltersDto(FiltersValidator),
  createInFiltersDto(InFiltersValidator),
  createDateRangeFiltersDto(DateRangeFiltersDto),
) {}
