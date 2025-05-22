import { Transform, Type } from 'class-transformer';
import { IsDefined, IsIn, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';

export const SORT_DIRECTIONS = ['ASC', 'DESC'] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export function createPaginationDto2<T extends Record<string, any>>(validFields: (keyof T)[]) {
  class SortItem {
    @IsDefined()
    @IsIn(validFields)
    field: keyof T;

    @IsDefined()
    @IsIn(SORT_DIRECTIONS)
    direction: SortDirection;
  }

  class PaginationContent {
    @IsOptional()
    @IsInt()
    @Min(0)
    offset?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @Transform(({ value }) => {
      if (!value || typeof value !== 'object') return [];
      return Object.entries(value).map(([field, dir]) => ({
        field,
        direction: String(dir).toUpperCase(),
      }));
    })
    @ValidateNested({ each: true })
    @Type(() => SortItem)
    sort?: SortItem[];
  }

  class PaginationWrapperDto {
    @IsOptional()
    @ValidateNested()

    @Type(() => PaginationContent)
    pagination?: PaginationContent;
  }

  return PaginationWrapperDto;
}
