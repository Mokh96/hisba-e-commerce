import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ClientCommonDto } from 'src/common-dtos/tier.common.dto';
import {
  BaseCreateShippingAddressDto,
  CreateSyncShippingAddressDto,
} from 'src/modules/shipping-addresses/dto/create-shipping-address.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { SyncIdDto } from 'src/common/dtos/sync-id.dto';

export class CreateClientBaseDto extends ClientCommonDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  ref: string;

/*  @IsOptional()
  @IsString()
  imgPath: string;*/

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
