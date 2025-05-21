import { translate } from 'src/startup/i18n/i18n.provider';

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

/*export const orderStatusesString = {
  [OrderStatus.NEW]: 'new',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.COMPLETED]: 'completed',
  [OrderStatus.CANCELED]: 'canceled',
};*/

export function getOrderStatusesString(status: OrderStatus) {
  switch (status) {
    case OrderStatus.NEW:
      return translate('orders.status.new');
    case OrderStatus.CONFIRMED:
      return translate('orders.status.confirmed');
    case OrderStatus.COMPLETED:
      return translate('orders.status.completed');
    case OrderStatus.CANCELED:
      return translate('orders.status.canceled');
    default:
      return translate('common.unknown');
  }
}

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
