import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { CreateClientBaseDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientBaseDto) {
  @Type(() => UpdateUserDto)
  @IsDefined()
  @ValidateNested()
  @IsOptional()
  user: UpdateUserDto;
}
