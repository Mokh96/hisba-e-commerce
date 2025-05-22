export const SORT_DIRECTIONS = ['ASC', 'DESC'] as const;

export const DEFAULT_PAGINATION_SETTINGS = {
  OFFSET: 0,
  LIMIT: 100,
  SORT_DIRECTION: 'DESC',
  SORT_BY: 'id',
} as const