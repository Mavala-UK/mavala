import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments/ProductItemFragment';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {productHandle} = params;

  if (!productHandle) {
    throw new Error('Expected product handle to be defined');
  }

  const {storefront} = context;

  const {productRecommendations} = await storefront.query(
    PRODUCT_RECOMMENDATIONS_RESOURCE_QUERY,
    {
      variables: {
        productHandle,
      },
      cache: storefront.CacheNone(),
    },
  );

  if (!productRecommendations) {
    throw new Response(null, {status: 404});
  }

  return Response.json(productRecommendations);
}

const PRODUCT_RECOMMENDATIONS_RESOURCE_QUERY = `#graphql
  query ProductRecommendations(
    $productHandle: String!
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    productRecommendations(productHandle: $productHandle) {
      ...ProductItem
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
