export enum OrderStatus {
  /**
   * The Order is new and has not been confirmed yet.
   * This is the initial status after the order has been created.
   */
  NEW = 1,
  /**
   * Order has been confirmed.
   */
  CONFIRMED = 2,
  /**
   * Order is completed.
   */
  COMPLETED = 3,
  /**
   * Order has been canceled.
   */
  CANCELED = 4,
}

export const orderStatusesString = {
  [OrderStatus.NEW]: 'new',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.COMPLETED]: 'completed',
  [OrderStatus.CANCELED]: 'canceled',
};

/**
 * Converts the OrderStatus enum to a normal object.
 * Since TypeScript enums also map values back to keys,
 * we need to filter out numeric keys.
 * @returns {Object} The OrderStatus enum as an object
 */
export const orderStatusObject = Object.keys(OrderStatus)
  .filter((key) => isNaN(Number(key))) // Filter out numeric keys
  .reduce((acc, key) => {
    acc[key] = OrderStatus[key as keyof typeof OrderStatus];
    return acc;
  }, {} as Record<string, number>);

/**
 * Represents an object containing order status identifiers.
 * Each property corresponds to a order status ID and holds its respective order status name.
 * @returns {Object}
 */
export const inverseOrderStatusObject = Object.keys(orderStatusObject).reduce((acc, key) => {
  const value = orderStatusObject[key];
  acc[value] = key;
  return acc;
}, {} as Record<number, string>);
