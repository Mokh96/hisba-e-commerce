import { IsDefined, IsOptional, IsString, IsStrongPassword, Length, ValidateIf } from 'class-validator';
import { Mismatch } from 'src/common/decorators/validators/mismatch.decorator';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @Length(2, 255)
  username: string;

  // Old password is optional, but if newPassword is provided => oldPassword required
  @ValidateIf((o) => o.newPassword != null)
  @IsDefined()
  @IsString()
  oldPassword?: string;

  // New password is optional, but if oldPassword is provided => newPassword required
  @ValidateIf((o) => o.oldPassword != null)
  @IsDefined()
  @IsString()
  @IsStrongPassword()
  @Mismatch('oldPassword', { message: 'validation.mismatch' })
  newPassword?: string;
}
