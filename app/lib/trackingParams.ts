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
 * Returns `target` with the allowlisted marketing params from `source`
 * re-appended. `target` is normally a clean path, but it may already carry a
 * query string (e.g. `/products/foo?Packaging=Tube`), in which case the
 * allowlisted params are merged into the existing query without clobbering it.
 * Returns `target` unchanged if no allowlisted params are present.
 */
export function withTrackingParams(
  target: string,
  source: URLSearchParams,
): string {
  const queryStart = target.indexOf('?');
  const path = queryStart === -1 ? target : target.slice(0, queryStart);
  const merged = new URLSearchParams(
    queryStart === -1 ? '' : target.slice(queryStart + 1),
  );

  for (const key of TRACKING_PARAM_KEYS) {
    const value = source.get(key);
    if (value !== null) {
      merged.set(key, value);
    }
  }

  const query = merged.toString();
  return query ? `${path}?${query}` : path;
}
