import { IsIn, IsOptional, ValidateNested, IsDefined, IsInt, Min, IsPositive, Max } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

export const SORT_DIRECTIONS = ['ASC', 'DESC'] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export const DEFAULT_PAGINATION_SETTINGS = {
  offset: 0,
  limit: 100,
  sortBy: 'id',
  sortDirection: 'DESC',
} as const;

export function createPaginationDto<T extends Record<string, any>>(validFields: (keyof T)[]) {
  class SortDtoItem {
    @IsDefined()
    @IsIn(validFields)
    field: keyof T;

    @IsDefined()
    @IsIn(SORT_DIRECTIONS)
    direction: SortDirection;
  }

  class PaginationDto {
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

    @IsOptional()
    @Transform(({ value }) => {
      if (!value || typeof value !== 'object') return [];

      return plainToInstance(
        SortDtoItem,
        Object.entries(value).map(([field, dir]) => ({
          field,
          direction: String(dir).toUpperCase(),
        })),
      );
    })
    @ValidateNested({ each: true })
    @Type(() => SortDtoItem)
    sort?: SortDtoItem[];
  }

  return PaginationDto;
}


const d = {
  search: {},
  filters: { label: '250' },
  in: {},
  gt: {},
  gte: {},
  lt: {},
  lte: {},
  sort: [
    { field: 'id', direction: 'DESC' },
    { field: 'maxPrice', direction: 'ASC' },
  ],
};
