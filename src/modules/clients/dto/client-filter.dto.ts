import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsMobilePhone, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class ClientFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  readonly syncId?: number | number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  readonly id?: number | number[];

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsPhoneNumber('DZ')
  readonly phone?: string;

  @IsOptional()
  @IsMobilePhone('ar-DZ')
  readonly mobile?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly rc?: string;

  @IsOptional()
  @IsString()
  readonly agr?: string;

  @IsOptional()
  @IsString()
  readonly ai?: string;

  @IsOptional()
  @IsString()
  readonly activity?: string;

  @IsOptional()
  @IsString()
  readonly legalForm?: string;

  @IsOptional()
  @IsString()
  readonly idFiscal?: string;

  @IsOptional()
  @IsString()
  readonly code?: string;

  @IsOptional()
  @IsString()
  readonly ref?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  readonly townId?: number | number[];
}
