/**
 * Default pagination settings.
 *
 * @readonly
 * @type {object}
 * @property {number} limit - The default limit for pagination.
 * @property {number} offset - The default offset for pagination.
 * @property {number} minLimit - The minimum limit allowed for pagination.
 * @property {number} maxLimit - The maximum limit allowed for pagination.
 * @property {number} minOffset - The minimum offset allowed for pagination.
 * @property {number} maxOffset - The maximum offset allowed for pagination.
 */

export const DEFAULT_PAGINATION_SETTINGS = {
  limit: 10,
  offset: 0,
  minLimit: 1,
  maxLimit: 100,
  minOffset: 0,
  maxOffset: 1000,
} as const;
