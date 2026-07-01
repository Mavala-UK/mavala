import { useLoaderData, type MetaFunction } from 'react-router';
import {getPaginationVariables, Analytics, getSeoMeta} from '@shopify/hydrogen';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import {FormattedMessage} from 'react-intl';
import {SearchForm} from '~/components/search/SearchForm';
import {SearchResults} from '~/components/search/SearchResults';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments/ProductItemFragment';
import {type RegularSearchReturn, type SearchProductNode} from '~/lib/search';
import {matchVariantForTerm} from '~/lib/searchVariantMatch';
import {ADMIN_VARIANT_SEARCH} from '~/graphql/admin/VariantSearchQuery';
import {ADMIN_PRODUCT_TITLE_SEARCH} from '~/graphql/admin/ProductTitleSearchQuery';
import type {RootLoader} from '~/root';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  data,
  matches: [root],
}) => {
  // Base label from the Sanity "search" translation, with a hard 'Search'
  // fallback. Without it an undefined title falls through to root.tsx's
  // seo.title:'404', rendering the results page as "404 | Mavala UK" (soft 404)
  // even on a 200 with results. Same class of bug as the /blog title fix.
  const searchLabel =
    root.data.translations.data.find(({id}) => id === 'search')?.message ??
    'Search';

  // With a query, title the page after the term; otherwise just the label.
  const term = data?.term?.trim();
  const title = term ? `${searchLabel} results for ${term}` : searchLabel;

  return [...(getSeoMeta(root.data.seo, {title}) ?? [])];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const searchPromise = regularSearch({request, context});

  (searchPromise as Promise<unknown>).catch((error: Error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}

export default function SearchPage() {
  const {term, result} = useLoaderData<typeof loader>();

  return (
    <>
      <VisuallyHidden asChild>
        <h1>
          <FormattedMessage id="search" />
        </h1>
      </VisuallyHidden>
      <SearchForm />
      {result?.total > 0 && (
        <SearchResults result={result} term={term}>
          {({products, term}) => (
            <SearchResults.Products products={products} term={term} />
          )}
        </SearchResults>
      )}
      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: SHOW,
      productFilters: [ {
         price:  {
            min: 0.1,
         }
      }]
    ) {
      nodes {
        ...on Product {
          ...ProductItem
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

async function regularSearch({
  request,
  context,
}: Pick<
  LoaderFunctionArgs,
  'request' | 'context'
>): Promise<RegularSearchReturn> {
  const {storefront, admin} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 24});
  const term = String(url.searchParams.get('q') || '');

  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term},
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  // ── Phase 1: Primary product search (Storefront API) ──────────────────────
  // Shopify's search with `types: [PRODUCT]` indexes product-level fields only
  // (title, description, tags, vendor, product_type). It does NOT index variant
  // titles or option values, so shade-name searches ("Riga", "Vert Empire")
  // return zero products. The Admin API fallback below handles that case.

  const productNodes = items?.products?.nodes ?? [];

  // ── Phase 2: Admin API variant search fallback ────────────────────────────
  // When the primary search returns few products, query variant titles directly
  // via the Admin API (which searches variant.title). For each matching variant
  // we fetch the parent product's full Storefront data and add it to the
  // results, so shade-name searches surface the correct product.

  if (productNodes.length < 5 && term.trim().length >= 2) {
    const variantProducts = await searchVariantsViaAdmin(admin, term);
    const existingHandles = new Set(
      productNodes.map((p) => (p as {handle: string}).handle),
    );

    const variantGids = variantProducts
      .filter((p) => !existingHandles.has(p.handle))
      .map((p) => p.gid);

    if (variantGids.length > 0) {
      const fallbackProducts = await fetchProductsByGids(storefront, variantGids);
      for (const fp of fallbackProducts) {
        productNodes.push(fp as (typeof productNodes)[number]);
      }
    }

    // ── Tier 3: Admin API product title search ──────────────────────────────
    // When variant title search finds nothing, try searching product titles
    // directly via the Admin API. This catches partial product-name matches
    // like "lumi" for "Crayon Lumiere".

    if (variantProducts.length === 0) {
      const titleProducts = await searchProductsViaAdmin(admin, term);
      const currentHandles = new Set(
        productNodes.map((p) => (p as {handle: string}).handle),
      );

      const titleGids = titleProducts
        .filter((p) => !currentHandles.has(p.handle))
        .map((p) => p.gid);

      if (titleGids.length > 0) {
        const titleFallbackProducts = await fetchProductsByGids(storefront, titleGids);
        for (const fp of titleFallbackProducts) {
          productNodes.push(fp as (typeof productNodes)[number]);
        }
      }
    }
  }

  // ── Attach variant match info ────────────────────────────────────────────
  // Surface the matching VARIANT for shade searches (e.g. "Riga", "701").
  // Attach searchVariantMatch onto each product node so ProductCard can render
  // the matched shade (variant image + name) and link to its canonical path
  // URL, rather than the parent product's default variant. Nodes that match
  // nothing keep searchVariantMatch === null and render unchanged.

  for (const node of productNodes) {
    (node as SearchProductNode).searchVariantMatch =
      matchVariantForTerm(node, term);
  }

  const total = Object.values(items).reduce(
    (acc, {nodes}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

/**
 * Escape special characters in a search term for use in the Admin API `query`
 * parameter. Replaces characters that have special meaning in Shopify's search
 * syntax with spaces, then collapses whitespace.
 */
function sanitiseSearchTerm(value: string): string {
  return value
    .replace(/[\\"]/g, ' ')
    .replace(/[(){}[\]!^~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeAdminQuery(value: string): string {
  return sanitiseSearchTerm(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * French vowel accent map for generating accent variants. Maps each vowel to
 * its common accented forms so that unaccented search terms ("celeste") can
 * match accented variant titles ("Céleste") in the Admin API.
 */
const ACCENT_MAP: Record<string, string[]> = {
  a: ['à', 'â'],   // à = à, â = â
  e: ['é', 'è', 'ê', 'ë'], // é = é, è = è, ê = ê, ë = ë
  i: ['î', 'ï'],   // î = î, ï = ï
  o: ['ô'],              // ô = ô
  u: ['ù', 'û', 'ü'], // ù = ù, û = û, ü = ü
  c: ['ç'],              // ç = ç
};

/**
 * Generate Admin API query terms for a single word, including both the original
 * (unaccented) form and variants with common French accents on each vowel.
 * Example: "celeste" -> ["celeste", "céleste", "cèleste", "celéste", "celèste", "celesté", "celestè"]
 */
function generateWordAccentVariants(word: string): string[] {
  if (!word) return [word];

  const variants = new Set<string>();
  variants.add(word); // original (unaccented) form

  for (let i = 0; i < word.length; i++) {
    const ch = word[i].toLowerCase();
    const accentForms = ACCENT_MAP[ch];
    if (!accentForms) continue;

    for (const accented of accentForms) {
      // Replace the vowel at position i with its accented form
      const variant = word.slice(0, i) + accented + word.slice(i + 1);
      variants.add(variant);
    }
  }

  return Array.from(variants).filter(Boolean);
}

/**
 * Build an Admin API query string that matches accent-insensitively.
 * For each word in the search term, generates accent variants and ORs them,
 * then ANDs the word groups together.
 * Example: "vert celeste" ->
 *   (title:*vert* OR title:*vért* OR title:*vèrt*) AND (title:*celeste* OR title:*céleste* OR ...)
 */
function buildAccentInsensitiveQuery(sanitised: string): string {
  const words = sanitised.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';

  const wordGroups = words.map((word) => {
    const variants = generateWordAccentVariants(word);
    return '(' + variants.map((v) => `title:*${v}*`).join(' OR ') + ')';
  });

  return wordGroups.join(' AND ');
}

/**
 * Search for variants via the Admin API when the primary Storefront API product
 * search returns few results. The Admin API `productVariants` query can search
 * variant titles directly, which is how we find products whose shade name
 * matches the search term but whose product-level fields do not.
 *
 * The query uses accent-insensitive matching: for each word, common French
 * accent variants (é, è, ê, ë, à, â, î, ï, ô, ù, û, ü, ç) are
 * generated and OR'd together, so unaccented searches ("celeste") match
 * accented variant titles ("Céleste") in the Admin API.
 *
 * Returns deduplicated product references (GID + handle) for the matched
 * variants' parent products. An empty array means no variants matched.
 */
async function searchVariantsViaAdmin(
  admin: unknown,
  term: string,
): Promise<Array<{gid: string; handle: string}>> {
  if (!term || term.trim().length < 2) return [];

  const sanitised = sanitiseSearchTerm(term);

  // Build an accent-insensitive query: for each word in the search term,
  // generate variants with common French accents and OR them together
  const query = buildAccentInsensitiveQuery(sanitised);
  if (!query) return [];

  try {
    const result = await (admin as {request: Function}).request(
      ADMIN_VARIANT_SEARCH,
      {variables: {query}},
    );

    if (!result?.data?.productVariants?.edges) return [];

    const seen = new Set<string>();
    const products: Array<{gid: string; handle: string}> = [];

    for (const edge of result.data.productVariants.edges) {
      const product = edge?.node?.product;
      if (product?.id && !seen.has(product.id)) {
        seen.add(product.id);
        products.push({gid: product.id, handle: product.handle});
      }
    }

    return products;
  } catch (e) {
    console.error('Variant search fallback failed:', e);
    return [];
  }
}

/**
 * Search for products via the Admin API when both primary Storefront search and
 * variant title search return zero results. The Admin API `products` query can
 * search product titles with accent-insensitive wildcards, finding partial name matches like "lumi"
 * that match no variant title but should surface the product.
 *
 * Returns deduplicated product references (GID + handle). An empty array means
 * no products matched the title search.
 */
async function searchProductsViaAdmin(
  admin: unknown,
  term: string,
): Promise<Array<{gid: string; handle: string}>> {
  if (!term || term.trim().length < 2) return [];

  const sanitised = sanitiseSearchTerm(term);

  // Build accent-insensitive query so "lumiere" (unaccented) matches
  // products with accented characters in their titles
  const query = buildAccentInsensitiveQuery(sanitised);
  if (!query) return [];

  try {
    const result = await (admin as {request: Function}).request(
      ADMIN_PRODUCT_TITLE_SEARCH,
      {variables: {query}},
    );

    if (!result?.data?.products?.edges) return [];

    const seen = new Set<string>();
    const products: Array<{gid: string; handle: string}> = [];

    for (const edge of result.data.products.edges) {
      const product = edge?.node;
      if (product?.id && !seen.has(product.id)) {
        seen.add(product.id);
        products.push({gid: product.id, handle: product.handle});
      }
    }

    return products;
  } catch (e) {
    console.error('Product title search fallback failed:', e);
    return [];
  }
}

/**
 * Fetch full product data (with variants) for a list of product GIDs, using
 * the Storefront API `nodes` query with the ProductItem fragment. Returns
 * an array whose elements have the same shape as search result product nodes,
 * suitable for matchVariantForTerm and ProductCard rendering.
 */
async function fetchProductsByGids(
  storefront: unknown,
  gids: string[],
): Promise<Array<Record<string, unknown>>> {
  if (gids.length === 0) return [];

  try {
    const result = await (
      storefront as {query: Function}
    ).query(PRODUCTS_BY_GID_QUERY, {variables: {ids: gids}});

    const nodes = (result as Record<string, unknown>)?.nodes as
      | Array<Record<string, unknown>>
      | undefined;
    return nodes?.filter(Boolean) ?? [];
  } catch (e) {
    console.error('Failed to fetch products by GID:', e);
    return [];
  }
}

/**
 * Storefront API query to fetch products by GID with the full ProductItem
 * fragment. Used by the Admin API fallback to get Storefront-shaped product
 * data for variant-matched products.
 */
const PRODUCTS_BY_GID_QUERY = `#graphql
  query ProductsByGid($ids: [ID!]!) {
    nodes(ids: $ids) {
      ...on Product {
        ...ProductItem
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
