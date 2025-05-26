import { FilterType, getFilterMap } from 'src/common/utils/filter-metadata.utils';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';
import { FiltersValidator, InFiltersValidator, SearchValidator } from 'src/modules/categories/dto/category-filter.dto';

export function getFilterCategoryMetadata(): Record<string, FilterType[]> {
  const filters: [Function, FilterType][] = [
    [SearchValidator, 'search'],
    [FiltersValidator, 'filters'],
    [InFiltersValidator, 'in'],
    [DateRangeFiltersDto, 'date'],
  ];

  return getFilterMap(filters);
}
