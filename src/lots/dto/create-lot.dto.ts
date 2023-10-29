import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateLotDto {
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

  @IsDecimal()
  price: number;

  @IsNumber()
  tva: number;

  @IsOptional()
  @IsDateString()
  dateExp: Date;

  @IsOptional()
  @IsBoolean()
  isDisponible: boolean;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsInt()
  @IsPositive()
  articleId: number;
}
