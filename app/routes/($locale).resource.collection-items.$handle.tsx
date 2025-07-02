import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {COLLECTION_ITEM_FRAGMENT} from '~/lib/fragments/CollectionItemFragment';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const first = Number(searchParams.get('first'));
  const priceMin = Number(searchParams.get('priceMin'));

  if (!handle) {
    throw new Error('Expected collection handle to be defined');
  }

  const {collection} = await storefront.query(COLLECTION_ITEM_RESOURCE_QUERY, {
    variables: {
      handle,
      first,
      priceMin,
    },
    cache: storefront.CacheNone(),
  });

  if (!collection?.id) {
    throw new Response(null, {status: 404});
  }

  return Response.json(collection);
}

const COLLECTION_ITEM_RESOURCE_QUERY = `#graphql
  query CollectionItemResource(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $first: Int,
    $priceMin: Float
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...CollectionItem
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
