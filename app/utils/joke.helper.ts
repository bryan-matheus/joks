/**
 * Validates the joke content.
 *
 * @param {string} content - The content of the joke.
 * @return {string | undefined} - Error message or undefined.
 */
export function validateJokeContent(content: string): string | undefined {
  if (content.length < 10) {
    return `That joke is too short`;
  }
}

/**
 * Validates the joke name.
 *
 * @param {string} name - The name of joke.
 * @return {string | undefined} - Error message or undefined.
 */
export function validateJokeName(name: string): string | undefined {
  if (name.length < 2) {
    return `That joke's name is too short`;
  }
}
