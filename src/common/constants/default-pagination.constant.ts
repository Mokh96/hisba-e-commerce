/**
 * Default pagination settings.
 *
 * @readonly
 * @enum {object}
 * @property {number} limit - The maximum number of items to return.
 * @property {number} offset - The starting index of the items to return.
 */

export const DEFAULT_PAGINATION_SETTINGS = {
  limit: 10,
  offset: 0,
} as const;
