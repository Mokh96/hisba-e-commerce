import { FilterType, getFilterMap } from 'src/common/utils/filter-metadata.utils';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import {
  SearchValidator,
  InFiltersValidator,
  FiltersValidator,
  EndsWithValidator,
  StartsWithValidator,
  NumberFilterValidator,
} from 'src/modules/products/dto/product-filter.dto';

export function getFilterProductMetadata(): Record<string, FilterType[]> {
  const filters: [Function, FilterType][] = [
    [SearchValidator, 'search'],
    [FiltersValidator, 'filters'],
    [InFiltersValidator, 'in'],
    [StartsWithValidator, 'sw'],
    [EndsWithValidator, 'ew'],
    [NumberFilterValidator, 'gt'],
    [NumberFilterValidator, 'gte'],
    [NumberFilterValidator, 'lt'],
    [NumberFilterValidator, 'lte'],
    [DateRangeFiltersDto, 'date'],
  ];

  return getFilterMap(filters);
}
