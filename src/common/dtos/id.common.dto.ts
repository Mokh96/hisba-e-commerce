import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class IdCommonDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  id: number;
}
