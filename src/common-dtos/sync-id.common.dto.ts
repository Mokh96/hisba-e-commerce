import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class SyncIdDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
