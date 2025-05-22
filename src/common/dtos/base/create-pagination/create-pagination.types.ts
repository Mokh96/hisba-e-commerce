import { SORT_DIRECTIONS } from 'src/common/dtos/base/create-pagination/pagination.constants';

export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export interface PaginationInterface {
  limit?: number;
  offset?: number;
  sort?: {
    field: string;
    direction: SortDirection;
  }[];
}
