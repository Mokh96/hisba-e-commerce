import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { UpdateShippingAddressDto } from 'src/modules/shipping-addresses/dto/update-shipping-address.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { CreateClientBaseDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientBaseDto) {
  @Type(() => UpdateUserDto)
  @IsDefined()
  @ValidateNested()
  @IsOptional()
  user: UpdateUserDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateShippingAddressDto)
  shippingAddresses: UpdateShippingAddressDto[];
}
