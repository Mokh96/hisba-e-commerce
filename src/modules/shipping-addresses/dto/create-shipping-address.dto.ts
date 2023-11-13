import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsString, Length } from 'class-validator';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';

export class CreateShippingAddressDto {
  @IsString()
  @Length(2, 255)
  address: string;
}

export class CreateSyncShippingAddressDto extends IntersectionType(
  CreateShippingAddressDto,
  SyncIdDto,
) {}
