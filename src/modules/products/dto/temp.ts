import { IsIn, IsOptional, ValidateNested, IsDefined, IsInt, Min, IsPositive, Max } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { DEFAULT_PAGINATION_SETTINGS } from 'src/modules/products/dto/temp2';

export const SORT_DIRECTIONS = ['ASC', 'DESC'] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export function createSortDto<T extends Record<string, any>>(validFields: (keyof T)[]) {
  class SortDtoItem {
    @IsDefined()
    @IsIn(validFields)
    field: keyof T;

    @IsDefined()
    @IsIn(SORT_DIRECTIONS)
    direction: SortDirection;
  }

  class SortDto {
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

  return SortDto;
}

export function createPaginationDto<T extends Record<string, any>>(validFields: (keyof T)[]) {
  class PaginationDto extends createSortDto<T>(validFields) {
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
  }

  class PaginationWrapperDto {
    @IsOptional()
    @ValidateNested()
    @Transform(({ value }) => {
      console.log(value);
      if (!value || typeof value !== 'object') return {};
      return value;
    })
    @Type(() => PaginationDto)
    pagination?: PaginationDto;
  }

  return PaginationDto;
}