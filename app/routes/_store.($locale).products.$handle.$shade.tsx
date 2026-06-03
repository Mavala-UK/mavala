/**
 * Path-based shade route: /products/<handle>/<shade-slug>
 *
 * This route is the SEO migration target. Each shade gets its own
 * canonical URL (/products/crayon-lumiere/vert-empire) so Google can
 * index individual shades independently.
 *
 * Server: resolves the shade slug to a variant via findVariantBySlug,
 * sets a per-shade canonical, and pre-populates the TanStack Query cache.
 * Frontend: renders the existing ProductMain/BundleMain tree (full
 * frontend integration - path-link navigation + drawer OOS fix - is
 * Chunk 4).
 *
 * Bad slug -> 301 to the bare product (protects backlinks).
 */

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import {useLoaderData, type MetaFunction} from 'react-router';
import type {SeoConfig} from '@shopify/hydrogen';
import {getSeoMeta} from '@shopify/hydrogen';
import type {RootLoader} from '~/root';
import {PRODUCT_FRAGMENT} from '~/lib/fragments/ProductFragment';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments/ProductItemFragment';
import {getYotpoReviews} from '~/lib/yotpo';
import {truncate} from '~/lib/utils';
import {findVariantBySlug, buildShadePath} from '~/lib/shadeUrl';
import type {ProductFragment} from 'storefrontapi.generated';
import {ProductMain} from '~/components/product/ProductMain';
import {BundleMain} from '~/components/bundle/BundleMain';
import groq from 'groq';
import {faqSectionFragment} from '~/sanity/fragments/faqSectionFragment';
import {articleFragment} from '~/sanity/fragments/articleFragment';
import type {
  ProductRelatedArticlesQueryResult,
  ProductFaqSectionQueryResult,
} from 'sanity.generated';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  data,
  matches: [root],
}) => {
  return getSeoMeta(root.data.seo, data?.seo);
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  if (criticalData instanceof Response) {
    return criticalData;
  }

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle, shade: shadeSlug} = params;

  if (!handle || !shadeSlug) {
    throw new Response(null, {status: 404});
  }

  const {storefront, env} = context;
  const pathPrefix = storefront.i18n.pathPrefix;
  const queryClient = new QueryClient();

  // Load the product with no pre-selected options -- we resolve the variant
  // by slug, not by query params. The empty selectedOptions are the cache key
  // the client will use when arriving at a clean path URL.
  const product = await queryClient.fetchQuery({
    queryKey: ['product', handle, []],
    queryFn: async () => {
      const {product: p} = await storefront.query(SHADE_PRODUCT_QUERY, {
        variables: {handle},
        cache: storefront.CacheShort(),
      });
      return p as ProductFragment | null;
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // Resolve the shade slug to a specific variant.
  const foundVariant = findVariantBySlug(product, shadeSlug);

  if (!foundVariant) {
    // Unknown slug -> 301 to bare product (never 404, to protect backlinks)
    throw redirect(`${pathPrefix}/products/${handle}`, {status: 301});
  }

  // Guard: free/zero-price variants are not for sale
  if ((foundVariant as any).price?.amount === '0.0') {
    throw new Response(null, {status: 404});
  }

  // Inject the path-resolved variant as the selected variant so the
  // ProductMain/BundleMain tree receives the correct shade on first render.
  (product as any).selectedVariant = foundVariant;

  // Update the cache entry with the injected selectedVariant so the
  // dehydrated state carries the correct shade to the client.
  queryClient.setQueryData(['product', handle, []], product);

  const origin = new URL(request.url).origin;
  // Per-shade canonical: the path URL itself (strip any trailing query params)
  const canonicalPath = `${pathPrefix}/products/${handle}/${shadeSlug}`;
  const canonicalUrl = `${origin}${canonicalPath}`;

  // Breadcrumbs (mirrors the parent product route logic)
  const canonicalCollection = (product as any).canonicalCollection?.reference;
  const parentCollection = canonicalCollection?.parentCollection?.reference;
  const grandParentCollection =
    parentCollection?.parentCollection?.reference;

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
    {title: `${product.title} - ${foundVariant.title}`},
  ];

  const yotpoReviews = await getYotpoReviews(
    product.id.split('/').pop()!,
    env.PRIVATE_YOTPO_APP_KEY as string,
  );

  const seo: SeoConfig = {
    title: `${product.seo?.title ?? product.title} - ${foundVariant.title}`,
    description: truncate(product.seo?.description ?? product.description),
    media: product.featuredImage && {
      url: product.featuredImage.url,
      type: 'image',
      width: 1200,
      height: 1200,
      altText: product.featuredImage.altText,
    },
    // Per-shade canonical: THIS is the SEO win.
    // Every shade canonicalises to ITSELF, not the bare product URL.
    url: canonicalUrl,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          item: (item as any).pathname
            ? `${origin}${(item as any).pathname}`
            : undefined,
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${product.title} - ${foundVariant.title}`,
        description: product.description,
        image: product.featuredImage?.url,
        sku: (foundVariant as any).sku ?? undefined,
        url: canonicalUrl,
        brand: {
          '@type': 'Brand',
          name: product.vendor,
        },
        offers: [
          {
            '@type': 'Offer',
            availability: (foundVariant as any).availableForSale
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            price: parseFloat((foundVariant as any).price?.amount ?? '0'),
            priceCurrency:
              (foundVariant as any).price?.currencyCode ?? 'GBP',
            sku: (foundVariant as any).sku ?? '',
            url: canonicalUrl,
            priceValidUntil: new Intl.DateTimeFormat('fr-CA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(new Date()),
          },
        ],
        ...(yotpoReviews?.reviews?.length! > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: yotpoReviews?.bottomline.average_score,
            reviewCount: yotpoReviews?.bottomline.total_review,
          },
        }),
      },
    ],
  };

  return {
    dehydratedState: dehydrate(queryClient),
    breadcrumbItems,
    yotpoReviews,
    seo,
    productType: product.productType,
  };
}

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
    {language, slug: handle},
  );

  const relatedArticles = sanity.loadQuery<ProductRelatedArticlesQueryResult>(
    productRelatedArticlesQuery,
    {language, slug: handle},
  );

  return {relatedProducts, faqSection, relatedArticles};
}

export default function ShadeProduct() {
  const {dehydratedState, productType} = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      {productType === 'Bundle' ? <BundleMain /> : <ProductMain />}
    </HydrationBoundary>
  );
}

// ── GraphQL ──────────────────────────────────────────────────────────────────

/**
 * Product query without pre-selected options.
 * We resolve the shade from params.shade via findVariantBySlug, then inject
 * the resolved variant as selectedVariant. Using $selectedOptions: [] means
 * variantBySelectedOptions returns null, which we overwrite.
 */
const SHADE_PRODUCT_QUERY = `#graphql
  query ShadeProduct(
    $language: LanguageCode
    $country: CountryCode
    $handle: String!
  ) @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ShadeProductRecommendations(
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
    "relatedArticles": relatedArticles[]->{
      ${articleFragment}
    }
  }
`;
