/**
 * @description
 * Returns the min and max prices from an array of objects with a `price` property.
 *
 * @example
 * getMaxAndMinPrices([{ price: 2 }, { price: 1 }, { price: 3 }]) // { minPrice: 1, maxPrice: 3 }
 * getMaxAndMinPrices([]) // { minPrice: 0, maxPrice: 0 }
 *
 * @param {Array<{ price: number }>} target - The array of objects with a `price` property.
 * @returns {object} An object with `minPrice` and `maxPrice` properties.
 * @throws {Error} If any item interceptors the array has an invalid price value.
 *
 */
export function getMaxAndMinPrices(target: { price: number }[]): { minPrice: number; maxPrice: number } {
  if (!target ||target.length === 0) {
    return { minPrice: 0, maxPrice: 0 };
  }

  const invalidItems = target.filter(({ price }) => price === undefined || price === null || isNaN(price));
  if (invalidItems.length > 0) {
    throw new Error(`All items must have a valid price.`);
  }

  const prices = target.map(({ price }) => price);
  return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
}
