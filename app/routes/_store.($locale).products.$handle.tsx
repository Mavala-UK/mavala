import groq from 'groq';
import {articleFragment} from '~/sanity/fragments/articleFragment';
import type {
  ProductRelatedArticlesQueryResult,
  ProductFaqSectionQueryResult,
} from 'sanity.generated';
import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {ProductMain} from '~/components/product/ProductMain';
import {BundleMain} from '~/components/bundle/BundleMain';
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import { useLoaderData, type MetaFunction } from 'react-router';
import type {SeoConfig} from '@shopify/hydrogen';
import type {RootLoader} from '~/root';
import {PRODUCT_FRAGMENT} from '~/lib/fragments/ProductFragment';
import {getSelectedProductOptions, getSeoMeta} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import type {ProductFragment} from 'storefrontapi.generated';
import {getVariantUrl, truncate} from '~/lib/utils';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments/ProductItemFragment';
import {getYotpoReviews} from '~/lib/yotpo';
import {faqSectionFragment} from '~/sanity/fragments/faqSectionFragment';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  data,
  matches: [root],
}) => {
  return getSeoMeta(root.data.seo, data?.seo);
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // If criticalData is a redirect Response, return it directly
  if (criticalData instanceof Response) {
    return criticalData;
  }

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const {storefront, env} = context;
  const pathPrefix = storefront.i18n.pathPrefix;
  const url = new URL(request.url);
  const variantParam = url.searchParams.get('variant');

  // Check if we have a Shopify-style numeric variant ID (not option name/value pairs)
  if (variantParam && /^\d+$/.test(variantParam)) {
    // Convert numeric ID to GraphQL ID format
    const variantGid = `gid://shopify/ProductVariant/${variantParam}`;

    try {
      // Fetch product to get variant options
      const {product: productForVariant} = await storefront.query(
        PRODUCT_QUERY_FOR_VARIANT_LOOKUP,
        {
          variables: {handle},
          cache: storefront.CacheShort(),
        },
      );

      if (productForVariant) {
        // Find the variant with this ID
        const variant = productForVariant.variants.nodes.find(
          (v: {id: string; selectedOptions: SelectedOption[]}) =>
            v.id === variantGid,
        );

        if (variant) {
          // Redirect to the proper Sanity URL format
          const newSearchParams = new URLSearchParams(url.search);
          newSearchParams.delete('variant');

          return redirect(
            getVariantUrl({
              handle,
              selectedOptions: variant.selectedOptions,
              searchParams: newSearchParams,
              pathPrefix,
            }),
            {status: 301},
          );
        }
      }
    } catch (error) {
      console.error('Error looking up variant:', error);
    }

    // If we couldn't find the variant, redirect to product page without variant param
    const newSearchParams = new URLSearchParams(url.search);
    newSearchParams.delete('variant');
    const cleanUrl = `${pathPrefix}/products/${handle}${newSearchParams.toString() ? `?${newSearchParams}` : ''}`;
    return redirect(cleanUrl, {status: 301});
  }

  const selectedOptions = getSelectedProductOptions(request);
  const queryClient = new QueryClient();

  const product = await queryClient.fetchQuery({
    queryKey: ['product', handle, selectedOptions],
    queryFn: async () => {
      const {product} = await storefront.query(PRODUCT_QUERY, {
        variables: {
          handle,
          selectedOptions,
        },
        cache: storefront.CacheShort(),
      });

      return product;
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request, pathPrefix});
    }
  }

  if (product.selectedVariant?.price.amount === '0.0') {
    throw new Response(null, {status: 404});
  }

  const canonicalCollection = product.canonicalCollection?.reference;
  const parentCollection = canonicalCollection?.parentCollection?.reference;
  const grandParentCollection = parentCollection?.parentCollection?.reference;

  const breadcrumbItems = [
    ...(grandParentCollection
      ? [
          {
            title: grandParentCollection.title,
            pathname: `${pathPrefix}/collections/${grandParentCollection.handle}`,
          },
        ]
      : []),
    ...(parentCollection
      ? [
          {
            title: parentCollection.title,
            pathname: `${pathPrefix}/collections/${parentCollection.handle}`,
          },
        ]
      : []),
    ...(canonicalCollection
      ? [
          {
            title: canonicalCollection.title,
            pathname: `${pathPrefix}/collections/${canonicalCollection.handle}`,
          },
        ]
      : []),
    {title: product.title},
  ];

  const yotpoReviews = await getYotpoReviews(
    product?.id.split('/').pop()!,
    env.PRIVATE_YOTPO_APP_KEY as string,
  );

  const seo = {
    title: product.seo.title ?? product.title,
    titleTemplate: product.seo.title ? '%s' : undefined,
    description: truncate(product.seo.description ?? product.description),
    media: product.featuredImage && {
      url: product.featuredImage.url,
      type: 'image',
      width: 1200,
      height: 1200,
      altText: product.featuredImage.altText,
    },
    url: decodeURIComponent(
      `${request.url.substring(0, request.url.lastIndexOf('/'))}/${
        product?.canonicalProduct?.reference?.handle ?? product?.handle
      }`,
    ),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          item: item.pathname
            ? `${new URL(request.url).origin}${item.pathname}`
            : undefined,
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.featuredImage?.url,
        sku: product.selectedVariant.sku ?? undefined,
        url: decodeURIComponent(request.url),
        brand: {
          '@type': 'Brand',
          name: product.vendor,
        },
        offers: product.variants.nodes.map((variant) => ({
          '@type': 'Offer',
          availability: variant.availableForSale
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          price: parseFloat(variant.price.amount),
          priceCurrency: variant.price.currencyCode,
          sku: variant?.sku ?? '',
          url: decodeURIComponent(
            `${request.url.split('?')[0]}?${new URLSearchParams(
              variant.selectedOptions.map((option) => [
                option.name,
                option.value,
              ]),
            )}`,
          ),
          priceValidUntil: new Intl.DateTimeFormat('fr-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).format(new Date()),
        })),
        ...(yotpoReviews?.reviews?.length! > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: yotpoReviews?.bottomline.average_score,
            reviewCount: yotpoReviews?.bottomline.total_review,
          },
        }),
      },
    ],
  } satisfies SeoConfig;

  return {
    dehydratedState: dehydrate(queryClient),
    breadcrumbItems,
    yotpoReviews,
    seo,
    productType: product.productType,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */

function loadDeferredData({context, params}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const {storefront, sanity} = context;
  const language = storefront.i18n?.language.toLowerCase();

  const relatedProducts = storefront.query(PRODUCT_RECOMMENDATIONS_QUERY, {
    variables: {productHandle: handle},
  });

  const faqSection = sanity.loadQuery<ProductFaqSectionQueryResult>(
    productFaqSectionQuery,
    {
      language,
      slug: handle,
    },
  );

  const relatedArticles = sanity.loadQuery<ProductRelatedArticlesQueryResult>(
    productRelatedArticlesQuery,
    {
      language,
      slug: handle,
    },
  );

  return {
    relatedProducts,
    faqSection,
    relatedArticles,
  };
}

function redirectToFirstVariant({
  product,
  request,
  pathPrefix,
}: {
  product: ProductFragment;
  request: Request;
  pathPrefix: string;
}) {
  const url = new URL(request.url);
  const defaultVariant =
    product?.defaultVariant?.reference ?? product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      handle: product.handle,
      selectedOptions: defaultVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
      pathPrefix,
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {dehydratedState, productType} = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      {productType === 'Bundle' ? <BundleMain /> : <ProductMain />}
    </HydrationBoundary>
  );
}

const PRODUCT_QUERY_FOR_VARIANT_LOOKUP = `#graphql
  query ProductVariantLookup(
    $language: LanguageCode
    $country: CountryCode
    $handle: String!
  ) @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      id
      handle
      variants(first: 250) {
        nodes {
          id
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
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

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
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

const productFaqSectionQuery = groq`
  *[_type == "product" && store.slug.current == $slug][0] {
    ${faqSectionFragment}
  }
`;

const productRelatedArticlesQuery = groq`
  *[_type == "product" && store.slug.current == $slug][0] {
    _id,
    _type,
    relatedArticles[]-> {
      ${articleFragment}
    }
  }
`;
