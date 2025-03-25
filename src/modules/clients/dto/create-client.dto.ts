import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';
import { ClientCommonDto } from 'src/common-dtos/tier.common.dto';

import {
  CreateShippingAddressDto,
  CreateSyncShippingAddressDto,
} from 'src/modules/shipping-addresses/dto/create-shipping-address.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateBaseClientDto extends ClientCommonDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  ref: string;

  @IsOptional()
  @IsString()
  imgPath: string;

  @IsOptional()
  @IsString()
  webPage: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShippingAddressDto)
  shippingAddresses: CreateShippingAddressDto[];
}

export class CreateClientDto extends CreateBaseClientDto {
  @Type(() => CreateUserDto)
  @IsDefined()
  @ValidateNested()
  user: CreateUserDto;
}

export class CreateClientSyncDto extends IntersectionType(OmitType(CreateClientDto, ['shippingAddresses']), SyncIdDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSyncShippingAddressDto)
  shippingAddresses: CreateSyncShippingAddressDto[];
}
