import {
  IsAlphanumeric,
  IsDate,
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class TierCommonDto {
  @IsString()
  @Length(2, 255)
  firstName: string;

  @IsString()
  @Length(2, 255)
  lastName: string;

  @IsString()
  @Length(2, 255)
  address: string;

  @IsOptional()
  @IsDateString()
  birthDate: Date;

  @IsOptional()
  @IsString()
  note: string;

  @IsPhoneNumber('DZ')
  phone: string;

  @IsOptional()
  @IsMobilePhone('ar-DZ')
  mobile: string;

  @IsOptional()
  @IsPhoneNumber()
  fax: string;

  @IsOptional()
  @IsEmail()
  email: string;

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
