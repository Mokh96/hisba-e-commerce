import { Transform, Type } from 'class-transformer';
import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

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

  @IsOptional()
  @IsBooleanString()
  isOutStock: boolean;

  @IsOptional()
  @IsBooleanString()
  isExpired: boolean;

  @IsOptional()
  @IsBooleanString()
  isMultiArticle: boolean;

  @IsOptional()
  @IsBooleanString()
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
}
