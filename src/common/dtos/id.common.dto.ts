import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class IdCommonDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  id: number;
}
