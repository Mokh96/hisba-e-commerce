import { IsIn, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

const sortBy = ['id', 'createdAt', 'updatedAt'] as const;
export const sortDirection = ['ASC', 'DESC'] as const;

export const DEFAULT_PAGINATION_SETTINGS = {
  offset: 0,
  limit: 100,
  sortBy: 'id',
  sortDirection: 'DESC',
} as const

export class PaginationDto {
  /**
   * Specifies the number of rows to skip in the result set (default is 0).
   * */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => value ?? DEFAULT_PAGINATION_SETTINGS.offset)
  offset?: number;

  /**
   *  Specifies the maximum number of rows to return (e.g., 100 max).
   * */
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(DEFAULT_PAGINATION_SETTINGS.limit)
  limit?: number;

  /**
   * Specifies the column to sort by (default is 'id', options: 'id', 'createdAt', 'updatedAt').
   * */
  @IsOptional()
  @IsString()
  @IsIn(sortBy)
  @Transform(({ value }) => value ?? DEFAULT_PAGINATION_SETTINGS.sortBy)
  sortBy?: (typeof sortBy)[number];

  /**
   * Specifies the sorting direction, either 'ASC' (ascending) or 'DESC' (descending). Default is 'DESC'
   * */
  @IsOptional()
  @IsIn(sortDirection)
  @Transform(({ value }) => value ?? DEFAULT_PAGINATION_SETTINGS.sortDirection)
  sortDirection?: (typeof sortDirection)[number];
}
