/**
 * Validates the username against a set of rules.
 *
 * @param {string} username - The username to be checked.
 * @return {string | undefined} - The error message.
 */
export function validateUsername(username: unknown): string | undefined {
  if (typeof username !== 'string' || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}
