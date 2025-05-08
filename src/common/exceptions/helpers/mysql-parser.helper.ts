/**
 * Extracts the field name from a MySQL NOT NULL constraint error.
 * Example: "Column 'username' cannot be null"
 */
export function extractNotNullField(message: string): string {
  const match = message.match(/Column '(.+?)' cannot be null/);
  return match ? match[1] : 'unknown';
}

/**
 * Extracts a field name from MySQL constraint errors that include `for key '...field'`
 * Used in: unique violations, foreign key violations, etc.
 * example: "Duplicate entry 'test' for key 'user.username'"
 */
export function extractFieldFromKeyMessage(message: string): string {
  const match = message.match(/for key '(.+?)'/);
  if (match) {
    const fullKey = match[1]; // e.g. 'user.username'
    const parts = fullKey.split('.');
    return parts.length === 2 ? parts[1] : fullKey; // extract 'username'
  }
  return 'unknown';
}

export const extractUniqueField = extractFieldFromKeyMessage; //alias for consistency
export const extractForeignKeyField = extractFieldFromKeyMessage; //alias for consistency

/**
 * Extracts the field name from a MySQL "Unknown column" error message.
 * Example: "Unknown column 'username'"
 *
 * @param message - The error message string to parse.
 * @returns The extracted column name, or `undefined` if not found.
 */
export function extractUnknownColumnField(message: string): string | undefined {
  const match = message.match(/Unknown column '(.+?)'/);
  return match?.[1];
}


/**
 * Extracts the field name from a DATA TOO LONG constraint error.
 */
export function extractDataTooLongField(message: string): string {
  const match = message.match(/Data too long for column '(.+?)'/);
  return match ? match[1] : 'unknown';
}


/**
 * Extracts the duplicate entry value from a MySQL error message.
 * Example: "Duplicate entry 'test' for key 'user.username'"
 *
 * @param message - The error message string to parse.
 * @returns The extracted duplicate entry value, or `undefined` if not found.
 */
export function extractDuplicateEntryValue(message: string): string | undefined {
  const match = message.match(/Duplicate entry '(.+?)'/);
  return match ? match[1] : undefined;
}

export function extractForeignKeyInfo(message: string) {
  const match = message.match(/FOREIGN KEY \(`(.+?)`\)/);
  const field = match ? match[1] : 'unknown';
  return { field };
}