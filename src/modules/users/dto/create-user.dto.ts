import { IsEnum, IsOptional, IsString, IsStrongPassword, Length } from 'class-validator';
import { Role } from 'src/common/enums/roles.enum';

export class CreateUserDto {
  @IsString()
  @Length(2, 255)
  username: string;

  @IsString()
  @Length(4, 255)
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'roleId must be a valid role' })
  roleId?: Role;
}
