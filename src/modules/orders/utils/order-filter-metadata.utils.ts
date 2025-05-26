import { FilterType, getFilterMap } from 'src/common/utils/filter-metadata.utils';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import {
  FiltersValidator,
  InFiltersValidator,
  SearchValidator,
  OrderFilterDto,
  NumberFilterValidator,
} from 'src/modules/orders/dto/order-filter.dto';


export function getFilterOrderMetadata(): Record<string, FilterType[]> {
  const filters: [Function, FilterType][] = [
    [SearchValidator, 'search'],
    [FiltersValidator, 'filters'],
    [InFiltersValidator, 'in'],
    [NumberFilterValidator, 'gt'],
    [NumberFilterValidator, 'gte'],
    [NumberFilterValidator, 'lt'],
    [NumberFilterValidator, 'lte'],
    [DateRangeFiltersDto, 'date'],
  ];

  return getFilterMap(filters);
}
