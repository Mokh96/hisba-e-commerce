import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsString, Length } from 'class-validator';

export class CreateShippingAddressDto {
  @IsString()
  @Length(2, 255)
  address: string;
}

export class CreateSyncShippingAddressDto extends CreateShippingAddressDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
