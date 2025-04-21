/**
 * A list of sensitive fields whose values should never be exposed in error messages.
 *
 * This is used in global exception filters (e.g., for database unique constraint violations)
 * to prevent leaking sensitive user data such as emails, phone numbers, or passwords.
 *
 * Example usage:
 * - If the `username` is duplicated and not sensitive, you may show:
 *     "The username 'john' is already taken"
 * - If the `email` is duplicated (and it's in this list), you should show:
 *     "This email is already taken" (without exposing the actual email)
 */
export const SENSITIVE_FIELDS = ['username'];

