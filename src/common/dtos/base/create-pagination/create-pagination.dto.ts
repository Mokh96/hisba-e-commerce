import { IsIn, IsOptional, ValidateNested, IsDefined, IsInt, Min, IsPositive, Max } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { SortDirection } from 'src/common/dtos/base/create-pagination/create-pagination.types';
import {
  DEFAULT_PAGINATION_SETTINGS,
  SORT_DIRECTIONS,
} from 'src/common/dtos/base/create-pagination/pagination.constants';

interface PaginationDtoType<T extends Record<string, any>> {
  sortFields: (keyof T)[];
}

function createPaginationSortDto<T extends Record<string, any>>({ sortFields }: PaginationDtoType<T>) {
  class SortDtoItem {
    @IsDefined()
    @IsIn(sortFields)
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

export function createPaginationDto<T extends Record<string, any>>({ sortFields }: PaginationDtoType<T>) {
  class PaginationDto extends createPaginationSortDto<T>({ sortFields }) {
    /**
     * Specifies the number of rows to skip in the result set (default is 0).
     * */
    @IsOptional()
    @IsInt()
    @Min(0)
    @Transform(({ value }) => value ?? DEFAULT_PAGINATION_SETTINGS.OFFSET)
    offset?: number;

    /**
     *  Specifies the maximum number of rows to return (e.g., 100 max).
     * */
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Max(DEFAULT_PAGINATION_SETTINGS.LIMIT)
    limit?: number;
  }

  return PaginationDto;
}
