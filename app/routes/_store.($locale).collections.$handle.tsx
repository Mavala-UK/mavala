import groq from 'groq';
import {use, Suspense} from 'react';
import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import { useRouteLoaderData, useLoaderData, type MetaFunction } from 'react-router';
import {truncate, getVariantUrl} from '~/lib/utils';
import {Analytics, type SeoConfig} from '@shopify/hydrogen';
import type {RootLoader} from '~/root';
import {
  getSeoMeta,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import type {
  CollectionRelatedArticlesQueryResult,
  SeoSectionQueryResult,
  InsertQueryResult,
  AdditionalSectionsQueryResult,
  CollectionFaqSectionQueryResult,
} from 'sanity.generated';
import {imageFragment} from '~/sanity/fragments/imageFragment';
import {linkFragment} from '~/sanity/fragments/linkFragment';
import {SeoSection} from '~/components/collection/SeoSection';
import {portableTextFragment} from '~/sanity/fragments/portableTextFragment';
import {collectionsFragment} from '~/sanity/fragments/collectionsFragment';
import {Breadcrumb} from '~/components/common/Breadcrumb';
import {CollectionHeader} from '~/components/collection/CollectionHeader';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments/ProductItemFragment';
import {ProductsList} from '~/components/collection/ProductsList';
import {FeaturedCollections} from '~/components/collection/FeaturedCollections';
import {HotPicks} from '~/components/home/HotPicks';
import {FocusCollection} from '~/components/home/FocusCollection';
import {EditorialSection} from '~/components/home/EditorialSection';
import {editorialSectionFragment} from '~/sanity/fragments/editorialSectionFragment';
import {videoFragment} from '~/sanity/fragments/videoFragment';
import {VideoSection} from '~/components/product/VideoSection';
import {VideoModuleType} from '~/components/product/VideoSection';
import {focusCollectionFragment} from '~/sanity/fragments/focusCollectionFragment';
import {articleFragment} from '~/sanity/fragments/articleFragment';
import {FaqSection} from '~/components/common/FaqSection';
import {FeaturedArticles} from '~/components/blog/FeaturedArticles';
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
  const {storefront} = context;
  const pathPrefix = storefront.i18n.pathPrefix;

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const {collection, collections} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
    cache: storefront.CacheShort(),
  });

  if (!collection || !collection.products.nodes.length) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  const parentCollection = collection?.parentCollection?.reference;
  const grandParentCollection = parentCollection?.parentCollection?.reference;
  const breadcrumbItems = [
    ...(grandParentCollection
      ? [
          {
            title: grandParentCollection?.title,
            pathname: `${pathPrefix}/collections/${grandParentCollection?.handle}`,
          },
        ]
      : []),
    ...(parentCollection
      ? [
          {
            title: parentCollection?.title,
            pathname: `${pathPrefix}/collections/${parentCollection?.handle}`,
          },
        ]
      : []),
    {title: collection.title},
  ];

  const seo = {
    title: collection.seo.title ?? collection.title,
    titleTemplate: collection.seo.title ? '%s' : undefined,
    description: truncate(collection.seo.description ?? collection.description),
    media: collection.image && {
      url: collection.image.url,
      type: 'image',
      width: 1200,
      height: 630,
      altText: collection.image.altText,
    },
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
        '@type': 'CollectionPage',
        name: collection.title ?? '',
        description: collection.description,
        image: collection.image?.url,
        url: `${new URL(request.url).origin}/collections/${collection.handle}`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: collection.products.nodes.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: decodeURIComponent(
              `${new URL(request.url).origin}${getVariantUrl({
                handle: product.handle,
                searchParams: new URLSearchParams(),
                selectedOptions: product.variants.nodes[0].selectedOptions,
                pathPrefix,
              })}`,
            ),
          })),
        },
      },
    ],
  } satisfies SeoConfig;

  return {
    collection,
    breadcrumbItems,
    collections: flattenConnection(collections),
    seo,
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
    throw redirect('/collections');
  }

  const {storefront, sanity} = context;
  const language = storefront.i18n?.language.toLowerCase();

  const insert = sanity.loadQuery<InsertQueryResult>(insertQuery, {
    language,
    slug: handle,
  });

  const additionalSections = sanity.loadQuery<AdditionalSectionsQueryResult>(
    additionalSectionsQuery,
    {
      language,
      slug: handle,
    },
  );

  const seoSection = sanity.loadQuery<SeoSectionQueryResult>(seoSectionQuery, {
    language,
    slug: handle,
  });

  const faqSection = sanity.loadQuery<CollectionFaqSectionQueryResult>(
    collectionFaqSectionQuery,
    {
      language,
      slug: handle,
    },
  );

  const relatedArticles =
    sanity.loadQuery<CollectionRelatedArticlesQueryResult>(
      collectionRelatedArticlesQuery,
      {
        language,
        slug: handle,
      },
    );

  return {
    insert,
    seoSection,
    faqSection,
    additionalSections,
    relatedArticles,
  };
}

export default function Collection() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {isMavalaFrance} = data?.sites ?? {};
  const {
    breadcrumbItems,
    collection,
    insert,
    seoSection,
    faqSection,
    relatedArticles: relatedArticlesPromise,
    additionalSections: additionalSectionsPromise,
  } = useLoaderData<typeof loader>();
  const additionalSections = use(additionalSectionsPromise);
  const {additionalBlocks} = additionalSections?.data ?? {};
  const {relatedArticles} = use(relatedArticlesPromise).data ?? {};

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <CollectionHeader showCategories={Boolean(!additionalBlocks)} />
      {!additionalBlocks ? (
        <ProductsList insert={insert} connection={collection?.products} />
      ) : (
        <>
          {additionalBlocks?.map((block) => {
            return (() => {
              switch (block._type) {
                case 'featuredCollections':
                  return (
                    <FeaturedCollections
                      key={block._key}
                      data={block}
                      noTitle
                    />
                  );
                case 'hotPicks':
                  return <HotPicks key={block._key} data={block} />;
                case 'editorialSection':
                  return <EditorialSection key={block._key} data={block} />;
                case 'focusCollection':
                  return <FocusCollection key={block._key} data={block} />;
                case 'videoModule':
                  return (
                    <VideoSection
                      key={block._key}
                      content={block as VideoModuleType}
                    />
                  );
              }
            })();
          })}
        </>
      )}
      <SeoSection data={seoSection} />
      <FaqSection data={faqSection} />
      {isMavalaFrance && (
        <Suspense>
          <FeaturedArticles relatedArticles={relatedArticles} />
        </Suspense>
      )}
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
        customData={{
          products: collection.products.nodes,
        }}
      />
    </>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $language: LanguageCode
    $country: CountryCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language, country: $country) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
        width
        height
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: COLLECTION_DEFAULT,
        filters: {price: {min: 0.1}}
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
      parentCollection: metafield(namespace: "custom", key: "parent_collection") {
        reference {
          ... on Collection {
            handle
            title
            parentCollection: metafield(namespace: "custom", key: "parent_collection") {
              reference {
                ... on Collection {
                  handle
                  title
                }
              }
            }
          }
        }
      }
      seo {
        title
        description
      }
    }
    collections(first: 100, sortKey: RELEVANCE) {
      nodes {
        handle
        title
        order: metafield(namespace: "custom", key: "order") {
          value
        }
        parentCollection: metafield(namespace: "custom", key: "parent_collection") {
          reference {
            ... on Collection {
              handle
              title
            }
          }
        }
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

const insertQuery = groq`
  *[_type == "collection" && store.slug.current == $slug][0] {
    _id,
    _type,
    insert{
      image {
        ${imageFragment}
      },
      "title": coalesce(
        title[_key == $language][0].value,
        title[0].value
      ),
      link {
        ${linkFragment}
      },
    }
  }
`;

const seoSectionQuery = groq`
  *[_type == "collection" && store.slug.current == $slug][0] {
    _id,
    _type,
    seoSection {
      "title": coalesce(
        title[_key == $language][0].value,
        title[0].value
      ),
      "text": coalesce(
        text[_key == $language][0].value,
        text[0].value
      )[] {
        ${portableTextFragment}
      },
      image {
        ${imageFragment}
      }
    }
  }
`;

const collectionFaqSectionQuery = groq`
  *[_type == "collection" && store.slug.current == $slug][0] {
    ${faqSectionFragment}
  }
`;

const additionalSectionsQuery = groq`
  *[_type == "collection" && store.slug.current == $slug][0] {
    _id,
    _type,
    additionalBlocks[] {
      _type == "featuredCollections" => {
        ${collectionsFragment}
      },
      _type == "hotPicks" => {
        ${collectionsFragment}
      },
      _type == "editorialSection" => {
        ${editorialSectionFragment}
      },
      _type == "focusCollection" => {
        ${focusCollectionFragment}
      },
      _type == "videoModule" => {
        _type,
        _key,
        "title": coalesce(
          title[_key == $language][0].value,
          title[0].value
        ),
        "text": coalesce(
          text[_key == $language][0].value,
          text[0].value
        ),
        "video": video {
          ${videoFragment}
        }
      }
    }
  }
`;

const collectionRelatedArticlesQuery = groq`
  *[_type == "collection" && store.slug.current == $slug][0] {
    _id,
    _type,
    relatedArticles[]-> {
      ${articleFragment}
    }
  }
`;
