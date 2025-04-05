import { UpdateMeDto } from 'src/modules/users/dto/update-me.dto';
import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

export class UpdateClientMeDto {
  @Type(() => UpdateMeDto)
  @IsDefined()
  @ValidateNested()
  user: UpdateMeDto;
}
