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
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 24});
  const term = String(url.searchParams.get('q') || '');

  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term},
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  // Surface the matching VARIANT for shade searches (e.g. "Riga", "701").
  // Attach searchVariantMatch onto each product node so ProductCard can render
  // the matched shade (variant image + name) and link to its canonical path
  // URL, rather than the parent product's default variant. Nodes that match
  // nothing keep searchVariantMatch === null and render unchanged.
  const productNodes = items?.products?.nodes ?? [];
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
