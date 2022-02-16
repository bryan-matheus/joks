/**
 * Validates a password against a set of rules.
 *
 * @param {string} password - The current password.
 * @return {string | undefined} - The error message.
 */
export function validatePassword(password: unknown): string | undefined {
  if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

/**
 * Validates a password against a set of rules.
 *
 * @param {string} password - The current password.
 * @return {string | undefined} - The error message.
 */
export function validateCurrentPassword(password: string): string | undefined {
  return validatePassword(password);
}

/**
 * Validates if the new password is the same repeated password.
 *
 * @param {string} password - The new password.
 * @param {string} repeatPassword - The new password repeated.
 * @return {string | undefined} - The error message.
 */
export function validateRepeatPassword(
  password: string,
  repeatPassword: string
): string | undefined {
  if (password !== repeatPassword) {
    return `Passwords do not match`;
  }
}

/**
 * Validates the new password against a set of rules.
 *
 * @param {string} password - The new password.
 * @return {string | undefined} - The error message.
 */
export function validateNewPassword(password: string): string | undefined {
  if (password.length < 8) {
    return `That password is too short`;
  }

  if (password.length > 255) {
    return `That password is too long`;
  }
}
