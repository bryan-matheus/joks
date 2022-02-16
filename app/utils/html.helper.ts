/**
 * Escapes CDATA section content.
 *
 * @param {string} s - string to be escaped.
 * @return {string} = escaped string.
 */
export function escapeCdata(s: string): string {
  return s.replace(/\]\]>/g, ']]]]><![CDATA[>');
}

/**
 * Escapes the given string in HTML.
 *
 * @param {string} s - string to escape
 * @return {string} - escaped string
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
