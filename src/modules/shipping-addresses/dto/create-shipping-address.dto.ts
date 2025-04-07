import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';

export class CreateShippingAddressDto {
  @IsString()
  @Length(2, 255)
  address: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  townId: number;
}

export class CreateSyncShippingAddressDto extends IntersectionType(CreateShippingAddressDto, SyncIdDto) {}
