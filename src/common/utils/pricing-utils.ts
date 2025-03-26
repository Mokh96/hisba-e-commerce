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
 */
export function getMaxAndMinPrices(target: { price: number }[]): { minPrice: number; maxPrice: number } {
  if (target.length === 0) {
    return { minPrice: 0, maxPrice: 0 };
  }

  const prices = target.map(({ price }) => price);
  return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
}
