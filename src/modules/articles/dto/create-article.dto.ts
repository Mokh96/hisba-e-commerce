import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsArray,
  ValidateNested, MaxLength, IsBoolean,
} from 'class-validator';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';

import { IdCommonDto } from 'src/common-dtos/id.common.dto';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { PRODUCT_FIELD_LENGTHS } from 'src/modules/products/config/products.config';
import { ARTICLE_FIELD_LENGTHS } from 'src/modules/articles/config/articles.config';
import { TransformStringToBoolean } from 'src/common/decorators';

export class CreateArticleDto {
  @IsString()
  @IsOptional()
  @MaxLength(ARTICLE_FIELD_LENGTHS.LABEL)
  label: string;

  @IsString()
  @IsOptional()
  @MaxLength(ARTICLE_FIELD_LENGTHS.REF)
  ref: string;

  @IsOptional()
  @IsString()
  @MaxLength(ARTICLE_FIELD_LENGTHS.NOTE)
  note: string;

  @IsOptional()
  @IsString()
  @MaxLength(ARTICLE_FIELD_LENGTHS.DESCRIPTION)
  description: string;

  @TransformStringToBoolean()
  @IsBoolean()
  isActive: boolean;

  @TransformStringToBoolean()
  @IsBoolean()
  isMultiLot: boolean;

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


//TODO: find batter implementation , tray to remove redundant
export class CreateSyncArticleDto extends IntersectionType(
  CreateArticleDto,
  SyncIdDto,
) {}
