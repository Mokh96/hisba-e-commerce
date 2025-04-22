/**
 * Generates a formatted validation message with field metadata prefix
 * @param field field name involved in the validation
 * @param message The actual validation message
 * @returns Formatted message with field metadata
 */
export function createFieldPrefixedMessage(field: string[], message: string): string {
  const fieldPrefix = `__${field}__:`;
  return `${fieldPrefix}${message}`;
}

/**
 * Extracts field name and message from a prefixed message
 * @param message The message that may contain field metadata prefix
 * @returns Object with field and clean message
 */
export function extractFieldFromMessage(message: string): { field: string; message: string } {
  // Check if message has our special format with fields prefix
  const prefixMatch = message.match(/^__(.+?)__:(.*)/);

  if (prefixMatch) {
    // Extract field and clean message
    return {
      field: prefixMatch[1], // The field name(s)
      message: prefixMatch[2].trim() // The clean message
    };
  }

  // For standard messages, try to extract field name from the first word
  const standardMatch = message.match(/^([a-zA-Z0-9_]+)\s(.*)/);
  if (standardMatch) {
    return {
      field: standardMatch[1],
      message: message
    };
  }

  // Default when no field can be extracted
  return {
    field: '_global',
    message: message
  };
}