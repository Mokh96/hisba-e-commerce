import { SelectQueryBuilder } from 'typeorm';
import { DEFAULT_PAGINATION_SETTINGS, PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { DateRangeDto } from 'src/common/dtos/filters/date-rang.dto';
import { SEARCH_CONFIG } from 'src/common/config/search.config';

type DateFields = 'createdAt' | 'updatedAt';

type ExtractFilterParams<T> = {
  [K in keyof T]?: string | number | boolean;
};

type ExtractInFilterParams<T> = {
  [K in keyof T]?: Array<string | number | boolean>;
};

type ExtractNumberFilters<T> = {
  [K in keyof T]?: number;
};

type BaseSelectFields = string[];

export class QueryUtils<T> {
  private constructor(private readonly queryBuilder: SelectQueryBuilder<T>, private readonly alias: string) {}

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
    suffix: string = '', // _gte, _lte
  ): void {
    if (!filters) return;

    Object.entries(filters).forEach(([field, value]) => {
      if (typeof value === 'number') {
        const paramName = `${field}${suffix}`;
        this.queryBuilder.andWhere(`${this.alias}.${field} ${operator} :${paramName}`, { [paramName]: value });
      }
    });
  }

  applySearch(search?: Record<string, string>): this {
    if (!search) return this;

    Object.entries(search).forEach(([field, value]) => {
      if (value) {
        // removing non-visible Unicode characters (e.g., if you deal with Arabic or RTL languages),
        // trimming and normalizing the search string:
        const cleanedValue = value
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
        if (typeof value === 'string' && value.trim() === '') {
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

    Object.entries(inFilters).forEach(([field, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        this.queryBuilder.andWhere(`${this.alias}.${field} IN (:...${field})`, {
          [field]: values,
        });
      }
    });

    return this;
  }

  /* applyGteFilterss<T extends object>(filters?: ExtractNumberFilters<T>): this {
    if (!filters) return this;

    Object.entries(filters).forEach(([field, value]) => {
      if (typeof value === 'number') {
        this.queryBuilder.andWhere(`${this.alias}.${field} >= :${field}_gte`, {
          [`${field}_gte`]: value,
        });
      }
    });

    return this;
  }

   applyLteFilterss<T extends object>(filters?: ExtractNumberFilters<T>): this {
    if (!filters) return this;

    Object.entries(filters).forEach(([field, value]) => {
      if (typeof value === 'number') {
        this.queryBuilder.andWhere(`${this.alias}.${field} <= :${field}_lte`, {
          [`${field}_lte`]: value,
        });
      }
    });

    return this;
  }*/

  /**
   * Applies date range filters to the query builder
   * @param dateFilters - Object containing date filters (e.g., createdAt, updatedAt)
   */
  applyDateFilters(dateFilters: Partial<Record<DateFields, DateRangeDto | undefined>>): this {
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
