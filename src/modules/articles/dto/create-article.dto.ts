import { OmitType } from '@nestjs/mapped-types';

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
import { CreateLotDto } from 'src/modules/lots/dto/create-lot.dto';

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
  @Type(() => createLotDtoArray)
  @IsArray()
  @ValidateNested({ each: true })
  lots: createLotDtoArray[];

  @IsOptional()
  @Type(() => IdCommonDto)
  @IsArray()
  @ValidateNested({ each: true })
  optionValues: IdCommonDto[];
}

class createLotDtoArray extends OmitType(CreateLotDto, [
  'articleId',
] as const) {}
