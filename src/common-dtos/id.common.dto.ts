import { IsInt, IsPositive } from 'class-validator';

export class Id {
  @IsPositive()
  @IsInt()
  id: number;
}
