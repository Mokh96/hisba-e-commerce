import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { SyncIdDto } from 'src/common/dtos/sync-id.dto';
import { gpsCoordinatesDto } from 'src/common/dtos/gps-coordinates/gps-coordinates.dto';
import { SHIPPING_ADDRESSES_LENGTHS } from 'src/modules/shipping-addresses/config/shipping-addresses.config';

export class BaseCreateShippingAddressDto extends gpsCoordinatesDto {
  @IsString()
  @Length(2, SHIPPING_ADDRESSES_LENGTHS.ADDRESS)
  address: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  townId: number;
}

export class CreateShippingAddressDto extends gpsCoordinatesDto {
  @IsString()
  @Length(2, SHIPPING_ADDRESSES_LENGTHS.ADDRESS)
  address: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  townId: number;
}

export class CreateSyncShippingAddressDto extends IntersectionType(CreateShippingAddressDto, SyncIdDto) {}
