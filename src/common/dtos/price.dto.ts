import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class PriceDto {
  @Type(() => Number)
  @IsNotEmpty()
  @Min(0)
  @IsInt()
  price: number;
}
