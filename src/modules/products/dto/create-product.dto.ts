import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateArticleDto, CreateSyncArticleDto } from 'src/modules/articles/dto/create-article.dto';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';
import { PRODUCT_FIELD_LENGTHS } from '../config/products.config';
import { TransformStringToBoolean } from '../../../common/decorators';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(PRODUCT_FIELD_LENGTHS.CODE)
  code: string;

  @IsOptional()
  @IsString()
  @MaxLength(PRODUCT_FIELD_LENGTHS.REF)
  ref: string;

  @IsOptional()
  @IsString()
  @MaxLength(PRODUCT_FIELD_LENGTHS.LABEL)
  label: string;

  @IsOptional()
  @IsString()
  @MaxLength(PRODUCT_FIELD_LENGTHS.LABEL2)
  label2: string;

  @IsOptional()
  @IsString()
  @MaxLength(PRODUCT_FIELD_LENGTHS.NOTE)
  note: string;

  @IsOptional()
  @IsString()
  @MaxLength(PRODUCT_FIELD_LENGTHS.DESCRIPTION)
  description: string;

  @TransformStringToBoolean({allowNull: false})
  @IsBoolean()
  isOutStock: boolean;

  @TransformStringToBoolean()
  @IsBoolean()
  @IsOptional()
  isExpired: boolean | undefined;

  @TransformStringToBoolean()
  @IsBoolean()
  @IsOptional()
  isMultiArticle: boolean | undefined;

  @TransformStringToBoolean()
  @IsBoolean()
  @IsOptional()
  isActive: boolean | undefined;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  brandId: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  categoryId: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  familyId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArticleDtoArray)
  articles: CreateArticleDtoArray[];
}

export class CreateArticleDtoArray extends OmitType(CreateArticleDto, ['productId'] as const) {}

export class CreateSyncArticleDtoArray extends IntersectionType(
  OmitType(CreateSyncArticleDto, ['productId'] as const),
) {}

export class CreateSyncProductDto extends IntersectionType(
  OmitType(CreateProductDto, ['articles'] as const),
  SyncIdDto,
) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSyncArticleDtoArray)
  articles: CreateSyncArticleDtoArray[];
}
