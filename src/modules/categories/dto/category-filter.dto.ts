import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateIf } from 'class-validator';
import { ARTICLE_FIELD_LENGTHS } from 'src/modules/articles/config/articles.config';
import { IntersectionType } from '@nestjs/mapped-types';
import { createFieldsDto } from 'src/common/dtos/base/create-fields.dto';
import { createSearchDto } from 'src/common/dtos/base/create-search.dto';
import { createFiltersDto } from 'src/common/dtos/base/create-filters.dto';
import { createInFiltersDto } from 'src/common/dtos/base/create-in-filters.dto';
import { createDateRangeFiltersDto } from 'src/common/dtos/base/create-date-range-filters.dto';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Transform } from 'class-transformer';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import IsNullablePositiveIntArray from 'src/common/decorators/validators/is-nullable-positive-int-array.dto';
import { parseNumberOrNull } from 'src/common/utils/transforms/transforms';

class FiltersValidator {
  @IsOptional()
  @Transform(({ obj, key }) => parseNumberOrNull(obj[key]))
  @IsInt()
  syncId?: number;

  @IsOptional()
  @Transform(({ obj, key }) => parseNumberOrNull(obj[key]))
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
  @Transform((params) => params.value.map(parseNumberOrNull))
  @IsNullablePositiveIntArray()
  parentId?: number[];

  @IsOptional()
  @Transform((params) => params.value.map(parseNumberOrNull))
  @IsNullablePositiveIntArray()
  syncId?: number[];
}

export class CategoryFilterDto extends IntersectionType(
  createFieldsDto(Category),
  createSearchDto(SearchValidator),
  createFiltersDto(FiltersValidator),
  createInFiltersDto(InFiltersValidator),
  createDateRangeFiltersDto(DateRangeFiltersDto),
) {}
