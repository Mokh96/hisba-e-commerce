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

import { IdCommonDto } from 'src/common-dtos/id.common.dto';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';
import { IntersectionType } from '@nestjs/mapped-types';

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
