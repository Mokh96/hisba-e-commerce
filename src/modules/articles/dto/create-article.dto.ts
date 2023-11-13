import { IntersectionType, OmitType } from '@nestjs/mapped-types';

import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';

import { Id } from 'src/common-dtos/id.common.dto';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';
import {
  CreateLotDto,
  CreateSyncLotDto,
} from 'src/modules/lots/dto/create-lot.dto';


export class CreateArticleDto {
  @IsOptional()
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  ref: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  description: string;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isActive: boolean;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isMultiLot: boolean;

  @Type(() => Number)
  @IsPositive()
  @IsInt()
  productId: number;

  @IsOptional()
  @Type(() => CreateLotDtoArray)
  @IsArray()
  @ValidateNested({ each: true })
  lots: CreateLotDtoArray[];

  @IsOptional()
  @Type(() => IdCommonDto)
  @IsArray()
  @ValidateNested({ each: true })
  optionValues: IdCommonDto[];
}

export class CreateLotDtoArray extends OmitType(CreateLotDto, [
  'articleId',
] as const) {}

export class CreateSyncLotDtoArray extends OmitType(CreateSyncLotDto, [
  'articleId',
] as const) {}

//TODO: find batter implementation , tray to remove redundant
export class CreateSyncArticleDto extends IntersectionType(
  OmitType(CreateArticleDto, ['lots'] as const),
  SyncIdDto,
) {
  @IsOptional()
  @Type(() => CreateSyncLotDtoArray)
  @IsArray()
  @ValidateNested({ each: true })
  lots: CreateSyncLotDtoArray[];
}
