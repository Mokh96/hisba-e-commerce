import { IsInt, IsPositive } from 'class-validator';

import { CreateLotDto } from './create-lot.dto';

export class CreateLotSyncDto extends CreateLotDto {
  @IsPositive()
  @IsInt()
  syncId: number;
}
