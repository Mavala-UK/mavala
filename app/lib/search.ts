import type {RegularSearchQuery} from 'storefrontapi.generated';
import type {VariantMatch} from '~/lib/searchVariantMatch';

type ResultWithItems<Type extends 'predictive' | 'regular', Items> = {
  type: Type;
  term: string;
  error?: string;
  result: {total: number; items: Items};
};

/**
 * A search product node augmented with the variant the search term matched.
 * `searchVariantMatch` is attached in the search loader (see
 * _store.($locale).search.tsx) and is null when no variant matched the term.
 */
export type SearchProductNode =
  RegularSearchQuery['products']['nodes'][number] & {
    searchVariantMatch?: VariantMatch | null;
  };

/**
 * RegularSearchQuery with each product node carrying its optional
 * searchVariantMatch. Same shape Shopify returns, plus the matched-variant
 * annotation the loader adds.
 */
export type RegularSearchQueryWithMatch = Omit<
  RegularSearchQuery,
  'products'
> & {
  products: Omit<RegularSearchQuery['products'], 'nodes'> & {
    nodes: SearchProductNode[];
  };
};

export type RegularSearchReturn = ResultWithItems<
  'regular',
  RegularSearchQueryWithMatch
>;

interface UrlWithTrackingParams {
  /** The base URL to which the tracking parameters will be appended. */
  baseUrl: string;
  /** The trackingParams returned by the Storefront API. */
  trackingParams?: string | null;
  /** Any additional query parameters to be appended to the URL. */
  params?: Record<string, string>;
  /** The search term to be appended to the URL. */
  term: string;
}

/**
 * A utility function that appends tracking parameters to a URL. Tracking parameters are
 * used internally by Shopify to enhance search results and admin dashboards.
 * @example
 * ```ts
 * const baseUrl = 'www.example.com';
 * const trackingParams = 'utm_source=shopify&utm_medium=shopify_app&utm_campaign=storefront';
 * const params = { foo: 'bar' };
 * const term = 'search term';
 * const url = urlWithTrackingParams({ baseUrl, trackingParams, params, term });
 * console.log(url);
 * // Output: 'https://www.example.com?foo=bar&q=search%20term&utm_source=shopify&utm_medium=shopify_app&utm_campaign=storefront'
 * ```
 */
export function urlWithTrackingParams({
  baseUrl,
  trackingParams,
  params: extraParams,
  term,
}: UrlWithTrackingParams) {
  let search = new URLSearchParams({
    ...extraParams,
    q: encodeURIComponent(term),
  }).toString();

  if (trackingParams) {
    search = `${search}&${trackingParams}`;
  }

  return `${baseUrl}?${search}`;
}
