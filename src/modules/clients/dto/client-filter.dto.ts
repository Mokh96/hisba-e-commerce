import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PRODUCT_FIELD_LENGTHS } from 'src/modules/products/config/products.config';
import { CLIENT_FIELD_LENGTHS } from 'src/modules/clients/config/client.config';
import { createFieldsDto } from 'src/common/dtos/base/create-fields.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { Client } from 'src/modules/clients/entities/client.entity';
import { createSearchDto } from 'src/common/dtos/base/create-search.dto';
import { createFiltersDto } from 'src/common/dtos/base/create-filters.dto';
import { createInFiltersDto } from 'src/common/dtos/base/create-in-filters.dto';
import { DateRangeDto } from 'src/common/dtos/filters/date-rang.dto';
import { createDateRangeFiltersDto } from 'src/common/dtos/base/create-date-range-filters-dto';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';

class FiltersValidator {
  @IsBoolean()
  @IsPositive()
  @Transform(({ value }) => Number(value) || undefined)
  syncId?: boolean;

  @IsBoolean()
  @IsPositive()
  @Transform(({ value }) => Number(value) || undefined)
  townId?: boolean;

  @IsBoolean()
  @IsPositive()
  @Transform(({ value }) => Number(value) || undefined)
  userId?: boolean;
}

class SearchValidator {
  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.FULL_NAME)
  @IsString()
  firstName?: string;


  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.ADDRESS)
  @IsString()
  address?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.NOTE)
  @IsString()
  note?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.PHONE)
  @IsString()
  phone?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.MOBILE)
  @IsString()
  mobile?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.FAX)
  @IsString()
  fax?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.EMAIL)
  @IsString()
  email?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.RC)
  @IsString()
  rc?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.AGR)
  @IsString()
  agr?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.AI)
  @IsString()
  ai?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.ACTIVITY)
  @IsString()
  activity?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.LEGAL_FROM)
  @IsString()
  legalForm?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.ID_FISCAL)
  @IsString()
  idFiscal?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.CODE)
  @IsString()
  code?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.REF)
  @IsString()
  ref?: string;

  @IsOptional()
  @MaxLength(CLIENT_FIELD_LENGTHS.WEB_PAGE)
  @IsString()
  webPage?: string;
}

class InFiltersValidator {
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsString({ each: true })
  @ArrayMaxSize(100)
  syncId?: number[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayMaxSize(100)
  townId?: number[];
}

class DateFieldsValidator extends DateRangeFiltersDto{
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  birthDate?: DateRangeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  createdAt?: DateRangeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  updatedAt?: DateRangeDto;
}

export class ClientFilterDto extends IntersectionType(
  createFieldsDto(Client),
  createSearchDto(SearchValidator),
  createFiltersDto(FiltersValidator),
  createInFiltersDto(InFiltersValidator),
  createDateRangeFiltersDto(DateFieldsValidator),
) {}
