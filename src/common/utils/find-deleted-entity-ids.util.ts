import { BaseEntity } from 'src/common/entities/base-entity.entity';

/**
 * Finds the IDs of entities in the `existingItems` array that are not present in the `updatedItems` array.
 *
 * @template T - A type that extends `BaseEntity`.
 * @param {T[]} existingItems - The list of existing entities.
 * @param {T[]} updatedItems - The list of updated entities.
 * @returns {number[]} - An array of IDs for entities that are considered deleted.
 *
 * @example
 * class Entity extends BaseEntity {
 *   name: string;
 * }
 *
 * const existingItems = [
 *   { id: 1, name: 'Item 1' },
 *   { id: 2, name: 'Item 2' },
 *   { id: 3, name: 'Item 3' },
 * ];
 *
 * const updatedItems = [
 *   { id: 1, name: 'Item 1' },
 *   { id: 3, name: 'Item 3' },
 * ];
 *
 * const result = findDeletedEntityIds(existingItems, updatedItems);
 * console.log(result); // Output: [2]
 */
export function findDeletedEntityIds<T extends BaseEntity>(existingItems: T[], updatedItems: T[]): number[] {
  const idsToKeep = updatedItems.map(i => i.id);
  const updatedSet = new Set(idsToKeep);
  return existingItems.filter(item => !updatedSet.has(item.id)).map(item => item.id);
}