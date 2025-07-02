import {getSelectedProductOptions} from '@shopify/hydrogen';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {PRODUCT_FRAGMENT} from '~/lib/fragments/ProductFragment';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const {storefront} = context;
  const {search} = new URL(request.url);

  const searchParams = new URLSearchParams(
    search === '' ? [['Title', 'Default Title']] : new URLSearchParams(search),
  );

  request = new Request(
    `${request.url.split('?')[0]}?${searchParams.toString()}`,
    request,
  );

  const {product} = await storefront.query(PRODUCT_RESOURCE_QUERY, {
    variables: {
      handle,
      selectedOptions: getSelectedProductOptions(request),
    },
    cache: storefront.CacheNone(),
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return Response.json(product);
}

const PRODUCT_RESOURCE_QUERY = `#graphql
  query ProductResource(
    $language: LanguageCode
    $country: CountryCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
