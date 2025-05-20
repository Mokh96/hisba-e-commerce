import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class ClientCommonDto {
  @IsString()
  @Length(2, 60)
  firstName: string;

  @IsString()
  @Length(2, 60)
  lastName: string;

  @IsString()
  @Length(2, 255)
  address: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  townId: number;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  birthDate: Date;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  mobile: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  fax: string;

  @IsOptional()
  @IsAlphanumeric()
  rc: string;

  @IsOptional()
  @IsAlphanumeric()
  agr: string;

  @IsOptional()
  @IsAlphanumeric()
  ai: string;

  @IsOptional()
  @IsAlphanumeric()
  idFiscal: string;

  @IsOptional()
  @IsString()
  activity: string;

  @IsOptional()
  @IsString()
  legalForm: string;
}
