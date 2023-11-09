import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsMobilePhone,
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

  @IsDate()
  birthDate: Date;

  @IsString()
  note: string;

  @IsPhoneNumber('DZ')
  phone: string;

  @IsMobilePhone('ar-DZ')
  mobile: string;

  @IsEmail()
  email: string;

  @IsString()
  fax: string;

  @IsAlphanumeric()
  rc: string;

  @IsAlphanumeric()
  agr: string;

  @IsAlphanumeric()
  ai: string;

  @IsAlphanumeric()
  idFiscal: string;

  @IsString()
  activity: string;

  @IsString()
  legalForm: string;
}
