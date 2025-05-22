import { IsArray, IsBoolean, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformStringToBoolean } from 'src/common/decorators';
import { ORDER_FIELD_LENGTHS } from 'src/modules/orders/config/orders.config';
import { ARTICLE_FIELD_LENGTHS } from 'src/modules/articles/config/articles.config';
import { IntersectionType } from '@nestjs/mapped-types';
import { createFieldsDto } from 'src/common/dtos/base/create-fields.dto';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Article } from 'src/modules/articles/entities/article.entity';
import { createSearchDto } from 'src/common/dtos/base/create-search.dto';
import { createFiltersDto } from 'src/common/dtos/base/create-filters.dto';
import { createInFiltersDto } from 'src/common/dtos/base/create-in-filters.dto';
import { createGtDto } from 'src/common/dtos/base/create-gt-filter.dto';
import { createGteDto } from 'src/common/dtos/base/create-gte-filter.dto';
import { createLtDto } from 'src/common/dtos/base/create-lt-filter.dto';
import { createLteDto } from 'src/common/dtos/base/create-lte-filter.dto';
import { createDateRangeFiltersDto } from 'src/common/dtos/base/create-date-range-filters.dto';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';

class NumberFilterValidator {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value) || undefined)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value) || undefined)
  totalTva?: number;
}

class FiltersValidator {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  syncId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  productId?: number;

  @IsBoolean()
  @IsOptional()
  @TransformStringToBoolean({ allowNull: false })
  isActive?: boolean;
}

class SearchValidator {
  @IsOptional()
  @MaxLength(ARTICLE_FIELD_LENGTHS.LABEL)
  @IsString()
  label?: string;

  @IsOptional()
  @MaxLength(ARTICLE_FIELD_LENGTHS.REF)
  @IsString()
  ref?: string;

  @IsOptional()
  @MaxLength(ARTICLE_FIELD_LENGTHS.NOTE)
  @IsString()
  note?: string;

  @IsOptional()
  @MaxLength(ARTICLE_FIELD_LENGTHS.DESCRIPTION)
  @IsString()
  description?: string;
}

class InFiltersValidator {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  productId?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  syncId?: number[];
}

export class ArticleFilterDto extends IntersectionType(
  createFieldsDto(Article),
  createSearchDto(SearchValidator),
  createFiltersDto(FiltersValidator),
  createInFiltersDto(InFiltersValidator),
  createGtDto(NumberFilterValidator),
  createGteDto(NumberFilterValidator),
  createLtDto(NumberFilterValidator),
  createLteDto(NumberFilterValidator),
  createDateRangeFiltersDto(DateRangeFiltersDto),
) {}
