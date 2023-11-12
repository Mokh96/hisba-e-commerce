import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsDateString,
  IsDecimal,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';

export class QueryLotDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  ref: string;

  @IsOptional()
  @IsString()
  nSeries: string;

  @IsOptional()
  @IsString()
  nLot: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsDecimal()
  price: number;

  @IsOptional()
  @IsNumber()
  tva: number;

  @IsOptional()
  @IsDateString()
  dateExp: Date;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isDisponible: boolean;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isActive: boolean;

  @IsOptional()
  @IsInt()
  @IsPositive()
  articleId: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  syncId?: number | number[];
}
