import {
  IsString,
  Length,
  IsNumber,
  Allow,
  Equals,
  IsIn,
} from 'class-validator';
import _ from 'lodash';

import { roles } from 'src/enums/roles.enum';

export class CreateUserDto {
  @IsString()
  @Length(2, 255)
  username: string;

  @IsString()
  @Length(4, 255)
  password: string;

  @IsNumber()
  @IsIn([roles.ADMIN])
  roleId: roles;
}
