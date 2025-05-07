/**
 * Represents a paginated result containing a collection of data items and the total number of items.
 *
 * @template T The type of the data items in the paginated result.
 * @property {T[]} data - The array of data items for the current page.
 * @property {number} totalItems - The total number of items available across all pages.
 */
export interface PaginatedResult<T = any> {
  data: T[];
  totalItems: number;
}
