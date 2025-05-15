import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateIf } from 'class-validator';
import { ARTICLE_FIELD_LENGTHS } from 'src/modules/articles/config/articles.config';
import { IntersectionType } from '@nestjs/mapped-types';
import { createFieldsDto } from 'src/common/dtos/base/create-fields.dto';
import { createSearchDto } from 'src/common/dtos/base/create-search.dto';
import { createFiltersDto } from 'src/common/dtos/base/create-filters.dto';
import { createInFiltersDto } from 'src/common/dtos/base/create-in-filters.dto';
import { createDateRangeFiltersDto } from 'src/common/dtos/base/create-date-range-filters-dto';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Transform } from 'class-transformer';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import IsNullablePositiveIntArray from 'src/common/decorators/validators/is-nullable-positive-int-array.dto';

class FiltersValidator {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  syncId?: number;

  @IsOptional()
  @IsArray()
  @Transform(({  key , obj }) => {
    if (obj[key] === 'null') return null;
    const parsed = Number(obj[key]);
    return isNaN(parsed) ? obj[key] : parsed;
  })
  @IsInt()
  parentId?: number | null;
}

class SearchValidator {
  @IsOptional()
  @MaxLength(ARTICLE_FIELD_LENGTHS.LABEL)
  @IsString()
  label?: string;
}

class InFiltersValidator {
  @IsOptional()
  @Transform(({ value }) => {
    return Array.isArray(value) ? value.map(transformToNumberOrNull) : [transformToNumberOrNull(value)];
  })
  @IsArray()
  @IsNullablePositiveIntArray()
  parentId?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  syncId?: number[];
}

function transformToNumberOrNull(value: string) {
  if (value === 'null') return null;
  const parsed = Number(value);
  return isNaN(parsed) ? value : parsed;
}

export class CategoryFilterDto extends IntersectionType(
  createFieldsDto(Category),
  createSearchDto(SearchValidator),
  createFiltersDto(FiltersValidator),
  createInFiltersDto(InFiltersValidator),
  createDateRangeFiltersDto(DateRangeFiltersDto),
) {}
