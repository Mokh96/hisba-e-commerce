import 'reflect-metadata';

const FILTER_META_KEY = Symbol('filter:meta');

export enum FilterType {
  SEARCH = 'search',
  FILTERS = 'filters',
  IN = 'in',
  NOT_IN = 'notIn',
  GT = 'gt',
  LT = 'lt',
  GTE = 'gte',
  LTE = 'lte',
  DATE_FROM = 'from',
  DATE_TO = 'to',
}

export function Filterable(...types: FilterType[]) {
  return function (target: any, propertyKey: string) {
    const existing = Reflect.getMetadata(FILTER_META_KEY, target.constructor) || {};
    Reflect.defineMetadata(
      FILTER_META_KEY,
      {
        ...existing,
        [propertyKey]: types,
      },
      target.constructor,
    );
  };
}

export function getFilterableFields(model: any): Record<string, FilterType[]> {
  return Reflect.getMetadata(FILTER_META_KEY, model) || {};
}
