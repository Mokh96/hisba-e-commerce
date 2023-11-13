import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CreateArticleDto,
  CreateSyncArticleDto,
} from 'src/modules/articles/dto/create-article.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  ref: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  label2: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  description: string;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isOutStock: boolean;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isExpired: boolean;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isMultiArticle: boolean;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isActive: boolean;

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

export class CreateArticleDtoArray extends OmitType(CreateArticleDto, [
  'productId',
] as const) {}

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
