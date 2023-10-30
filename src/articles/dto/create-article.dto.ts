import { OmitType } from '@nestjs/mapped-types';

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Id } from 'src/common-dtos/id.common.dto';
import { CreateLotDto } from 'src/lots/dto/create-lot.dto';

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

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsBoolean()
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
  @Type(() => Id)
  @IsArray()
  @ValidateNested({ each: true })
  optionValues: Id[];
}

class createLotDtoArray extends OmitType(CreateLotDto, [
  'articleId',
] as const) {}
