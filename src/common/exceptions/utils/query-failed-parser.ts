export function extractFieldFromMySqlMessage(message: string): string {
  // Example: Duplicate entry 'test' for key 'user.username'
  const match = message.match(/for key '(.+?)'/);
  if (match) {
    const fullKey = match[1]; // e.g. 'user.username'
    const parts = fullKey.split('.');
    return parts.length === 2 ? parts[1] : fullKey; // extract 'username'
  }
  return 'unknown';
}


export function extractFieldFromMessage(message: string): string {
  const match = message.match(/for key '(.+?)'/);
  if (!match) return 'unknown';
  const [, fullKey] = match;
  const parts = fullKey.split('.');
  return parts[1] || parts[0] || 'unknown';
}

export function extractValueFromMessage(message: string): string | undefined {
  const match = message.match(/Duplicate entry '(.+?)'/);
  return match ? match[1] : undefined;
}