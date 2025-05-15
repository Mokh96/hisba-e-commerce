import { SelectQueryBuilder } from 'typeorm';
import { DEFAULT_PAGINATION_SETTINGS, PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { DateRangeDto } from 'src/common/dtos/filters/date-rang.dto';
import { SEARCH_CONFIG } from 'src/common/config/search.config';
import {
  BaseSelectFields,
  DateFields,
  ExtractFilterParams,
  ExtractInFilterParams,
  ExtractNumberFilters,
  ExtractSearchParams,
} from 'src/common/utils/query-utils/query-utils.types';
import { DateRangeFiltersDto } from 'src/common/dtos/base/date-range-filters.dto';

export class QueryUtils<T> {
  constructor(private readonly queryBuilder: SelectQueryBuilder<T>, private readonly alias: string) {}

  static use<T>(queryBuilder: SelectQueryBuilder<T>): QueryUtils<T> {
    return new QueryUtils(queryBuilder, queryBuilder.alias);
  }

  applySelectFields(fields?: BaseSelectFields): this {
    if (!fields || fields.length === 0) return this;

    const selectFields = fields.map((field) => `${this.alias}.${field}`);
    this.queryBuilder.select(selectFields);
    return this;
  }

  private applyNumericComparisonFilter(
    filters: ExtractNumberFilters<T> | undefined,
    operator: '>' | '>=' | '<' | '<=',
    suffix: '_gte' | '_lte' | '' = '',
  ): void {
    if (!filters) return;

    Object.entries(filters).forEach(([field, value]) => {
      if (typeof value === 'number') {
        const paramName = `${field}${suffix}`;
        this.queryBuilder.andWhere(`${this.alias}.${field} ${operator} :${paramName}`, { [paramName]: value });
      }
    });
  }

  applySearch<T extends object>(search?: ExtractSearchParams<T>): this {
    if (!search) return this;

    Object.entries(search).forEach(([field, value]) => {
      if (value) {
        // removing non-visible Unicode characters (e.g., if you deal with Arabic or RTL languages),
        // trimming and normalizing the search string:
        const cleanedValue = (value as string)
          .trim()
          .replace(/\p{C}+/gu, '')
          .replace(/\s+/g, ' ');

        if (cleanedValue.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
          // You can also log or collect ignored fields
          return;
        }

        const normalized = `%${cleanedValue}%`;
        this.queryBuilder.andWhere(`LOWER(${this.alias}.${field}) LIKE LOWER(:${field})`, {
          [field]: normalized,
        });
      }
    });

    return this;
  }

  applyFilters<T extends object>(filters?: ExtractFilterParams<T>): this {
    if (!filters) return this;

    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined) {
        if (value === null) {
          // Handle null specifically
          this.queryBuilder.andWhere(`${this.alias}.${field} IS NULL`);
        } else if (typeof value === 'string' && value.trim() === '') {
          // Empty string: check for NULL or empty string
          this.queryBuilder.andWhere(`(${this.alias}.${field} IS NULL OR ${this.alias}.${field} = '')`);
        } else {
          this.queryBuilder.andWhere(`${this.alias}.${field} = :${field}`, { [field]: value });
        }
      }
    });

    return this;
  }

  applyGtFilters(filters?: ExtractNumberFilters<T>): this {
    this.applyNumericComparisonFilter(filters, '>');
    return this;
  }

  applyLtFilters(filters?: ExtractNumberFilters<T>): this {
    this.applyNumericComparisonFilter(filters, '<');
    return this;
  }

  applyGteFilters(filters?: ExtractNumberFilters<T>): this {
    this.applyNumericComparisonFilter(filters, '>=', '_gte');
    return this;
  }

  applyLteFilters(filters?: ExtractNumberFilters<T>): this {
    this.applyNumericComparisonFilter(filters, '<=', '_lte');
    return this;
  }

  applyInFilters<T extends object>(inFilters?: ExtractInFilterParams<T>): this {
    if (!inFilters) return this;

    // Iterate over each field and its corresponding array of values
    Object.entries(inFilters).forEach(([field, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        // Separate non-null values and check if null is present
        const notNullValues = values.filter((v) => v !== null);
        const hasNull = values.includes(null);

        const conditions: string[] = [];
        const parameters: Record<string, any> = {};

        // Add condition for non-null values
        if (notNullValues.length > 0) {
          conditions.push(`${this.alias}.${field} IN (:...${field})`);
          parameters[field] = notNullValues;
        }

        // Add condition for null values
        if (hasNull) {
          conditions.push(`${this.alias}.${field} IS NULL`);
        }

        // Combine conditions with 'OR' and apply to query builder
        if (conditions.length > 0) {
          this.queryBuilder.andWhere(conditions.join(' OR '), parameters);
        }
      }
    });

    return this;
  }

  applyNotIn<T extends object>(notInFilters?: ExtractInFilterParams<T>) {
    if (!notInFilters) return this;

    Object.entries(notInFilters).forEach(([field, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        this.queryBuilder.andWhere(`${this.alias}.${field} NOT IN (:...${field}NotIn)`, {
          [`${field}NotIn`]: values,
        });
      }
    });

    return this;
  }

  /**
   * Applies date range filters to the query builder
   * @param dateFilters - Object containing date filters (e.g., createdAt, updatedAt)
   */
  applyDateFilters3(dateFilters: Partial<Record<DateFields, DateRangeDto | undefined>>): this {
    if (!dateFilters) return this;

    Object.entries(dateFilters).forEach(([field, value]) => {
      if (value) {
        const { from, to } = value;

        if (from) {
          this.queryBuilder.andWhere(`${this.alias}.${field} >= :${field}From`, {
            [`${field}From`]: new Date(from),
          });
        }
        if (to) {
          this.queryBuilder.andWhere(`${this.alias}.${field} <= :${field}To`, {
            [`${field}To`]: new Date(to),
          });
        }
      }
    });

    return this;
  }

  /*  applyDateFilters2(dateFilters: Partial<Record<string, DateRangeDto | undefined>>) {
      console.log('dateFilters' , dateFilters);
      if (!dateFilters) return this;
  
      for (const [field, range] of Object.entries(dateFilters)) {
        console.log(field, range);
  
        if (range.from) {
          this.queryBuilder.andWhere(`${this.alias}.${field} >= :${field}From`, {
            [`${field}From`]: range.from,
          });
        }
        if (range.to) {
          this.queryBuilder.andWhere(`${this.alias}.${field} <= :${field}To`, {
            [`${field}To`]: range.to,
          });
        }
      }
    }*/

  applyDateFilters(dateFilters: Record<string, DateRangeDto | undefined> | object) {
    if (!dateFilters) return this;

    // Convert the input to entries we can iterate over
    const entries = Object.entries(dateFilters);

    for (const [field, range] of entries) {
      // Skip if the range is not a valid DateRangeDto
      if (!range || typeof range !== 'object') continue;

      // Check if the object has from/to properties to ensure it's a DateRangeDto
      if (!('from' in range) && !('to' in range)) continue;

      // Type assertion since we've validated this is a DateRangeDto-like object
      const dateRange = range as DateRangeDto;

      if (dateRange.from) {
        this.queryBuilder.andWhere(`${this.alias}.${field} >= :${field}From`, {
          [`${field}From`]: dateRange.from,
        });
      }
      if (dateRange.to) {
        this.queryBuilder.andWhere(`${this.alias}.${field} <= :${field}To`, {
          [`${field}To`]: dateRange.to,
        });
      }
    }

    return this;
  }

  applyPagination(paginationDto?: PaginationDto): this {
    const {
      limit,
      offset = 0,
      sortBy = DEFAULT_PAGINATION_SETTINGS.sortBy,
      sortDirection = DEFAULT_PAGINATION_SETTINGS.sortDirection,
    } = paginationDto || {};

    console.log(paginationDto);
    if (sortBy) {
      this.queryBuilder.orderBy(`${this.alias}.${sortBy}`, sortDirection);
    }

    this.queryBuilder.skip(offset);

    if (limit) {
      this.queryBuilder.take(limit);
    }

    return this;
  }

  getQueryBuilder(): SelectQueryBuilder<T> {
    return this.queryBuilder;
  }
}
