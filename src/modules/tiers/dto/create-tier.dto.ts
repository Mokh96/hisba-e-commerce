import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { TierCommonDto } from 'src/common-dtos/tier.common.dto';
import { CreateShippingAddressDto } from 'src/modules/shipping-addresses/dto/create-shipping-address.dto';

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

  shippingAddress: CreateShippingAddressDto[];
}

export class CreateSyncTierDto extends CreateTierDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
