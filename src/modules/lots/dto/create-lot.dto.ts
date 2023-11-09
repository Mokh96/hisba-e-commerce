import { IntersectionType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsDecimal,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';

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

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isDisponible: boolean;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isActive: boolean;

  @IsInt()
  @IsPositive()
  articleId: number;
}

export class CreateSyncLotDto extends IntersectionType(
  CreateLotDto,
  SyncIdDto,
) {}
