import { IsInt, IsPositive } from 'class-validator';

export class IdCommonDto {
  @IsPositive()
  @IsInt()
  id: number;
}
