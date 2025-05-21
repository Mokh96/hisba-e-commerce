import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class SyncIdDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}