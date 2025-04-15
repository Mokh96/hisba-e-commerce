import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class TvaPercentageDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Max(100)
  @Min(0)
  tvaPercentage: number;
}