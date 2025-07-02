import { useLoaderData, type MetaFunction } from 'react-router';
import {getPaginationVariables, Analytics, getSeoMeta} from '@shopify/hydrogen';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import {FormattedMessage} from 'react-intl';
import {SearchForm} from '~/components/search/SearchForm';
import {SearchResults} from '~/components/search/SearchResults';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments/ProductItemFragment';
import {type RegularSearchReturn} from '~/lib/search';
import type {RootLoader} from '~/root';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  matches: [root],
}) => {
  return [
    ...(getSeoMeta(root.data.seo, {
      title: root.data.translations.data.find(({id}) => id === 'search')
        ?.message,
    }) ?? []),
  ];
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

  const total = Object.values(items).reduce(
    (acc, {nodes}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}
