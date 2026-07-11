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
 * Read the gclid from the _gcl_aw cookie, if present.
 *
 * _gcl_aw format: GCL.<timestamp>.<gclid_value>
 *
 * On the server side, pass the Cookie header from the incoming request.
 * On the client side, pass nothing and it reads document.cookie.
 *
 * Returns null if no cookie or if the format doesn't match.
 */
export function getGclidFromCookie(cookieHeader?: string): string | null {
  const cookies =
    cookieHeader ?? (typeof document !== 'undefined' ? document.cookie : '');
  const match = cookies.match(/(?:^|;\s*)_gcl_aw=GCL\.\d+\.([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Append a gclid query param to a URL string if the gclid is available from
 * the _gcl_aw cookie. On the server side, pass the Cookie header so the
 * cookie can be read from the incoming request.
 *
 * Returns the URL unchanged if no gclid is available. If url is null/undefined,
 * returns fallback (defaults to '/').
 */
export function appendGclidToUrl(
  url: string | null | undefined,
  cookieHeader?: string,
  fallback?: string,
): string {
  if (!url) return fallback ?? '/';
  const gclid = getGclidFromCookie(cookieHeader);
  if (!gclid) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}gclid=${encodeURIComponent(gclid)}`;
}

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
