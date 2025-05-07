import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class IdCommonDto {
  @Type(() => Number)
  @IsNotEmpty({ each: true })
  @IsPositive({ each: true })
  @IsInt({ each: true })
  id: number;
}
