import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class SyncIdDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  syncId: number;
}
