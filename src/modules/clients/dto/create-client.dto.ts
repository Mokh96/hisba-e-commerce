import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsArray,
  IsDate,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  BaseCreateShippingAddressDto,
  CreateSyncShippingAddressDto,
} from 'src/modules/shipping-addresses/dto/create-shipping-address.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { SyncIdDto } from 'src/common/dtos/sync-id.dto';
import { CLIENT_FIELD_LENGTHS } from 'src/modules/clients/config/client.config';

export class CreateClientBaseDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.TRADE_NAME)
  tradeName: string;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.FIRST_NAME)
  firstName: string;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.LAST_NAME)
  lastName: string;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.ADDRESS)
  address: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  townId: number;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.CODE)
  code: string;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.REF)
  ref: string;

  @IsOptional()
  //@Type(() => Date)
  @IsDate()
  birthDate: Date;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.NOTE)
  note: string;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.PHONE)
  phone: string;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.MOBILE)
  mobile: string;

  @IsOptional()
  @IsEmail()
  @Length(5, CLIENT_FIELD_LENGTHS.EMAIL)
  email: string;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.FAX)
  fax: string;

  @IsOptional()
  @IsAlphanumeric()
  @Length(2, CLIENT_FIELD_LENGTHS.RC)
  rc: string;

  @IsOptional()
  @IsAlphanumeric()
  @Length(2, CLIENT_FIELD_LENGTHS.AGR)
  agr: string;

  @IsOptional()
  @IsAlphanumeric()
  @Length(2, CLIENT_FIELD_LENGTHS.AI)
  ai: string;

  @IsOptional()
  @IsAlphanumeric()
  @Length(2, CLIENT_FIELD_LENGTHS.ID_FISCAL)
  idFiscal: string;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.ACTIVITY)
  activity: string;

  @IsOptional()
  @IsString()
  @Length(2, CLIENT_FIELD_LENGTHS.LEGAL_FORM)
  legalForm: string;

  @IsOptional()
  @IsString()
  webPage: string;
}

export class CreateClientDto extends CreateClientBaseDto {
  @Type(() => CreateUserDto)
  @IsDefined()
  @ValidateNested()
  user: CreateUserDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseCreateShippingAddressDto)
  shippingAddresses: BaseCreateShippingAddressDto[];
}

export class CreateClientSyncDto extends IntersectionType(OmitType(CreateClientDto, ['shippingAddresses']), SyncIdDto) {
  @Type(() => CreateSyncShippingAddressDto)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  shippingAddresses: CreateSyncShippingAddressDto[];
}
