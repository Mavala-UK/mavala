import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments/ProductItemFragment';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const {storefront} = context;

  const {product} = await storefront.query(PRODUCT_ITEM_RESOURCE_QUERY, {
    variables: {
      handle,
    },
    cache: storefront.CacheNone(),
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return Response.json(product);
}

const PRODUCT_ITEM_RESOURCE_QUERY = `#graphql
  query ProductItemResource(
    $language: LanguageCode
    $country: CountryCode
    $handle: String!
  ) @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      ...ProductItem
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
