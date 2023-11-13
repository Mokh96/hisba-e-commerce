import { Transform, Exclude } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { roles } from 'src/enums/roles.enum';

export class CreateUserDto {
  @IsString()
  @Length(2, 255)
  username: string;

  @IsString()
  @Length(4, 255)
  password: string;
}
