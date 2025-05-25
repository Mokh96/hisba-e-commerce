import { LabelCommonDto } from 'src/common/dtos/label.common.dto';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class CreateOptionDto extends LabelCommonDto {}

export class CreateOptionSyncDto extends CreateOptionDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
