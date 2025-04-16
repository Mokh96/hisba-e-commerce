import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, IsPositive, IsString, Length, ValidateIf } from 'class-validator';
import { SHIPPING_ADDRESSES_LENGTHS } from '../config/shipping-addresses.config';
import { gpsCoordinatesDto } from 'src/common/dtos/gps-coordinates/gps-coordinates.dto';

export class UpdateShippingAddressDto extends gpsCoordinatesDto {
  // Optional ID: if present, it's an update
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  // If id is undefined, address is required, otherwise it's optional validate if address is defined
  @ValidateIf((o) => o.id === undefined || o.address !== undefined)
  @IsDefined()
  @IsString()
  @Length(2, SHIPPING_ADDRESSES_LENGTHS.ADDRESS)
  address?: string;

  // If id is undefined, townId is required, otherwise it's optional validate if townId is defined
  @ValidateIf((o) => o.id === undefined || o.townId !== undefined)
  @IsDefined()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  townId?: number;
}

new UpdateShippingAddressDto()
