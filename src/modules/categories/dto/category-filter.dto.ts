import { IsArray, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { ARTICLE_FIELD_LENGTHS } from 'src/modules/articles/config/articles.config';
import { IntersectionType } from '@nestjs/mapped-types';
import { createFieldsDto } from 'src/common/dtos/base/create-fields.dto';
import { createSearchDto } from 'src/common/dtos/base/create-search.dto';
import { createFiltersDto } from 'src/common/dtos/base/create-filters.dto';
import { createInFiltersDto } from 'src/common/dtos/base/create-in-filters.dto';
import { createDateRangeFiltersDto } from 'src/common/dtos/base/create-date-range-filters-dto';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import { Category } from 'src/modules/categories/entities/category.entity';

class FiltersValidator {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  syncId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  parentId?: number;
}

class SearchValidator {
  @IsOptional()
  @MaxLength(ARTICLE_FIELD_LENGTHS.LABEL)
  @IsString()
  label?: string;
}

class InFiltersValidator {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  parentId?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  syncId?: number[];
}

export class CategoryFilterDto extends IntersectionType(
  createFieldsDto(Category),
  createSearchDto(SearchValidator),
  createFiltersDto(FiltersValidator),
  createInFiltersDto(InFiltersValidator),
  createDateRangeFiltersDto(DateRangeFiltersDto),
) {}
