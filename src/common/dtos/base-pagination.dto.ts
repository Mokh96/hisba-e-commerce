import { IsIn, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { DEFAULT_PAGINATION_SETTINGS } from '../constants';

export class BasePaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(DEFAULT_PAGINATION_SETTINGS.minOffset)
  offset?: number = DEFAULT_PAGINATION_SETTINGS.offset;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(DEFAULT_PAGINATION_SETTINGS.maxLimit)
  limit?: number = DEFAULT_PAGINATION_SETTINGS.limit;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortDirection?: 'ASC' | 'DESC' = 'DESC';
}
