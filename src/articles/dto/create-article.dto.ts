import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
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
  @Type(() => CreateLotDto)
  @IsArray()
  @ArrayMinSize(1)
  lots: CreateLotDto[];
}
