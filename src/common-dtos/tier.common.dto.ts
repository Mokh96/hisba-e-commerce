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
  fullName: string;

  @IsString()
  @Length(2, 255)
  address: string;

  @IsOptional()
  @IsDateString()
  //@IsDate()
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
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
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
