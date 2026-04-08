/**
 * Converts a product name into a URL-safe slug.
 * Example: "Long Grain Parboiled Rice" → "long-grain-parboiled-rice"
 *
 * Note: This is intentionally naive — deduplification of slug collisions
 * is out of scope for this assessment (documented in README trade-offs).
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // strip non-alphanumeric chars
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse consecutive hyphens
    .trim();
}
