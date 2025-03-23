import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 255)
  username: string;

  @IsString()
  @Length(4, 255)
  password: string;
}
