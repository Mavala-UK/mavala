/**
 * Marketing tracking-param preservation across canonical redirects.
 *
 * The shade/variant redirects build a clean canonical path for SEO and drop
 * the query string. That strips ad-click identifiers (gclid etc.) before the
 * Google tag can read them, so conversion cookies (_gcl_aw) never get written.
 *
 * We re-append an allowlist of marketing params to the canonical path so paid
 * and email visitors keep their attribution through the redirect, while the
 * path itself stays canonical (we never re-append Shade/variant/etc.).
 */

const TRACKING_PARAM_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'gclsrc',
  'fbclid',
  'msclkid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

/**
 * Returns `path` (a clean path with no query string) with the allowlisted
 * marketing params from `source` re-appended. Returns `path` unchanged if no
 * allowlisted params are present.
 */
export function withTrackingParams(
  path: string,
  source: URLSearchParams,
): string {
  const preserved = new URLSearchParams();
  for (const key of TRACKING_PARAM_KEYS) {
    const value = source.get(key);
    if (value !== null) {
      preserved.set(key, value);
    }
  }

  const query = preserved.toString();
  return query ? `${path}?${query}` : path;
}
