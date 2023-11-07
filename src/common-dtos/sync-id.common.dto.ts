import { IsInt, IsPositive } from 'class-validator';

export class SyncIdDto {
  @IsPositive()
  @IsInt()
  syncId: number;
}
