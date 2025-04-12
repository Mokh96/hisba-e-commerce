import { IsIn, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { DEFAULT_PAGINATION_SETTINGS } from '../constants';

export class BasePaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = DEFAULT_PAGINATION_SETTINGS.offset;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(100)
  limit?: number = DEFAULT_PAGINATION_SETTINGS.limit;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortDirection?: 'ASC' | 'DESC' = 'DESC';
}
