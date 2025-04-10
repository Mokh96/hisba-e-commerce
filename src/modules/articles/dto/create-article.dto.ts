import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { IdCommonDto } from 'src/common/dtos/id.common.dto';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { ARTICLE_FIELD_LENGTHS } from 'src/modules/articles/config/articles.config';
import { TransformStringToBoolean } from 'src/common/decorators';

export class CreateArticleDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  syncId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(ARTICLE_FIELD_LENGTHS.LABEL)
  label: string;

  @IsString()
  @IsOptional()
  @MaxLength(ARTICLE_FIELD_LENGTHS.REF)
  ref: string;

  @IsOptional()
  @IsString()
  @MaxLength(ARTICLE_FIELD_LENGTHS.DESCRIPTION)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(ARTICLE_FIELD_LENGTHS.NOTE)
  note: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  price: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Max(100)
  @Min(0)
  tvaPercentage: number;

  @TransformStringToBoolean()
  @IsBoolean()
  @IsOptional()
  isActive: boolean | undefined;

  @Type(() => Number)
  @IsPositive()
  @IsInt()
  productId: number;

  @IsOptional()
  @Type(() => IdCommonDto)
  @IsArray()
  @ValidateNested({ each: true })
  optionValues: IdCommonDto[];
}

export class CreateSyncArticleDto extends IntersectionType(CreateArticleDto, SyncIdDto) {}
