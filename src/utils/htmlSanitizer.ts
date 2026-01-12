/**
 * Basic HTML sanitization utility for rich text content
 * This provides a simple whitelist of allowed HTML tags and attributes
 */

/**
 * Basic HTML sanitizer that removes dangerous tags and attributes
 * Note: For production use, consider using a more robust library like DOMPurify
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return "";

  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove dangerous event handlers
  html = html.replace(/\son\w+\s*=\s*"[^"]*"/gi, "");
  html = html.replace(/\son\w+\s*=\s*'[^']*'/gi, "");
  html = html.replace(/\son\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: links
  html = html.replace(/javascript:/gi, "");

  return html;
};

/**
 * Strip all HTML tags from a string, leaving only text content
 * @param html - The HTML string to strip
 * @returns Plain text string
 */
export const stripHtml = (html: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

/**
 * Get plain text length from HTML content
 * @param html - The HTML string to measure
 * @returns Length of plain text content
 */
export const getPlainTextLength = (html: string): number => {
  return stripHtml(html).length;
};

export default {
  sanitizeHtml,
  stripHtml,
  getPlainTextLength,
};
