import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class BaseFilterDto {
  @IsOptional()
  @IsString()
  readonly label?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  readonly syncId?: number | number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  readonly id?: number | number[];
}
