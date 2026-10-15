/**
 * Ensures a URL string is absolute so that browsers don't treat domain-only strings
 * as relative paths (e.g. prevents "example.com" from navigating to "https://currentdomain.com/example.com").
 */
export function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';

  // Already includes a supported protocol/scheme
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed)) {
    return trimmed;
  }

  // Protocol-relative URLs like "//example.com"
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // Plain domains like "example.com" or "example.com/demo"
  return `https://${trimmed}`;
}
