import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';
import { TierCommonDto } from 'src/common-dtos/tier.common.dto';
import { tierType } from 'src/enums/tier-type.enum';
import {
  CreateShippingAddressDto,
  CreateSyncShippingAddressDto,
} from 'src/modules/shipping-addresses/dto/create-shipping-address.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateTierDto extends TierCommonDto {
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

  @IsEnum(tierType)
  tierTypeId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShippingAddressDto)
  shippingAddresses: CreateShippingAddressDto[];

  @Type(() => CreateUserDto)
  @IsDefined()
  @ValidateNested()
  user: CreateUserDto;
}

export class CreateSyncTierDto extends IntersectionType(
  OmitType(CreateTierDto, ['shippingAddresses']),
  SyncIdDto,
) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSyncShippingAddressDto)
  shippingAddresses: CreateSyncShippingAddressDto[];
}
