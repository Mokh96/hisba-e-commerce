export type DateFields = 'createdAt' | 'updatedAt';

export type ExtractFilterParams<T> = {
  [K in keyof T]?: string | number | boolean;
};

export type ExtractInFilterParams<T> = {
  [K in keyof T]?: Array<string | number | boolean>;
};

export type ExtractNumberFilters<T> = {
  [K in keyof T]?: number;
};

export type BaseSelectFields = string[];
