/**
 * Calculates the HTTP status code for a bulk operation based on the number of successes and failures.
 *
 * @param {Object} options - An object with two properties: `success` and `failures`, both of which are numbers.
 * @returns {number} The HTTP status code for the bulk operation.
 */
export function getBulkStatus({ failures, success }: { failures: number; success: number }): number {
  if (failures > 0 && success > 0) {
    // If there are both failures and successes, return a 207 status code (Multi-Status).
    return 207;
  } else if (failures > 0) {
    // If there are failures but no successes, return a 400 status code (Bad Request).
    return 400;
  } else {
    // If there are no failures, return a 200 status code (OK).
    return 200;
  }
}
