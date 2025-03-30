import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
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
  @IsOptional() //its optional because related image is not required
  _uid: string | undefined;

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

  @Type(() => Number)
  @Min(0)
  @IsInt()
  price: number;

  @TransformStringToBoolean()
  @IsBoolean()
  isActive: boolean;

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
export class CreateSyncArticleDto extends IntersectionType(CreateArticleDto, SyncIdDto) {}
