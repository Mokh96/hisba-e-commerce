import { FilterType, getFilterMap } from 'src/common/utils/filter-metadata.utils';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import {
  NumberFilterValidator,
  FiltersValidator,
  InFiltersValidator,
  SearchValidator,
} from 'src/modules/articles/config/article-filter.dto';

export function getFilterArticleMetadata(): Record<string, FilterType[]> {
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
