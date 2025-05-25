import { getMetadataStorage, MetadataStorage } from 'class-validator';

export type FilterType = 'search' | 'filters' | 'in' | 'notIn' | 'gt' | 'gte' | 'lt' | 'lte' | 'sw' | 'ew' | 'date';

export function getFilterMap(filters: [Function, FilterType][]): Record<string, FilterType[]> {
  const result: Record<string, FilterType[]> = {};

  const metadataStorage = getMetadataStorage() as MetadataStorage;

  for (const [cls, type] of filters) {
    const props = metadataStorage.getTargetValidationMetadatas(cls, '', false, false).map((meta) => meta.propertyName);

    for (const prop of props) {
      if (!result[prop]) {
        result[prop] = [];
      }
      if (!result[prop].includes(type)) {
        result[prop].push(type);
      }
    }
  }

  return result;
}
