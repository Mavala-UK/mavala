import groq from 'groq';
import {use, Suspense} from 'react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSeoMeta, type SeoConfig} from '@shopify/hydrogen';
import { useRouteLoaderData, useLoaderData, type MetaFunction } from 'react-router';
import type {
  HeroQueryResult,
  BlocksQueryResult,
  SeoHomeQueryResult,
  RelatedArticlesQueryResult,
} from 'sanity.generated';
import imageUrlBuilder from '@sanity/image-url';
import {truncate} from '~/lib/utils';
import {seoFragment} from '~/sanity/fragments/seoFragment';
import type {RootLoader} from '~/root';
import {imageFragment} from '~/sanity/fragments/imageFragment';
import {videoFragment} from '~/sanity/fragments/videoFragment';
import {linkFragment} from '~/sanity/fragments/linkFragment';
import {collectionsFragment} from '~/sanity/fragments/collectionsFragment';
import {HeroHeader} from '~/components/home/HeroHeader';
import {FeaturedCollections} from '~/components/collection/FeaturedCollections';
import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import {editorialSectionFragment} from '~/sanity/fragments/editorialSectionFragment';
import {EditorialSection} from '~/components/home/EditorialSection';
import {HotPicks} from '~/components/home/HotPicks';
import {FocusCollection} from '~/components/home/FocusCollection';
import {focusCollectionFragment} from '~/sanity/fragments/focusCollectionFragment';
import {articleFragment} from '~/sanity/fragments/articleFragment';
import {FeaturedArticles} from '~/components/blog/FeaturedArticles';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  matches: [root],
  data,
}) => {
  return [
    ...(getSeoMeta(root.data.seo, {
      ...data?.seo,
      title:
        data?.seo.title ??
        root.data.translations.data.find(({id}) => id === 'homepage')?.message,
    }) ?? []),
  ];
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
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const {storefront, sanity} = context;

  const hero = await sanity.loadQuery<HeroQueryResult>(heroQuery, {
    language: storefront.i18n?.language.toLowerCase(),
  });

  const seoQuery = await sanity.loadQuery<SeoHomeQueryResult>(seoHomeQuery, {
    language: storefront.i18n?.language.toLowerCase(),
  });

  const {title, description, image} = seoQuery.data?.seo ?? {};

  const builder = imageUrlBuilder({
    projectId: context.env.SANITY_PROJECT_ID,
    dataset: context.env.SANITY_DATASET || 'production',
  });

  const seo = {
    title,
    titleTemplate: title ? '%s' : undefined,
    description: truncate(description ?? ''),
    media:
      image &&
      builder
        .image(image)
        .format('jpg')
        .width(1200)
        .height(630)
        .fit('crop')
        .url(),
  } satisfies SeoConfig;

  return {hero, seo};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {storefront, sanity} = context;
  const language = storefront.i18n?.language.toLowerCase();

  const blocks = sanity.loadQuery<BlocksQueryResult>(blocksQuery, {
    language,
  });

  const relatedArticles = sanity.loadQuery<RelatedArticlesQueryResult>(
    relatedArticlesQuery,
    {
      language,
    },
  );

  return {
    blocks,
    relatedArticles,
  };
}

export default function Homepage() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {shop, sites} = data ?? {};
  const {isMavalaCorporate, isMavalaFrance} = sites ?? {};
  const {
    hero,
    blocks: blocksPromise,
    relatedArticles: relatedArticlesPromise,
  } = useLoaderData<typeof loader>();

  const blocks = use(blocksPromise);
  const {featuredCollections, hotPicks, editorialSection, focusCollection} =
    blocks?.data ?? {};
  const {relatedArticles} = use(relatedArticlesPromise).data ?? {};

  return (
    <>
      <VisuallyHidden asChild>
        <h1>{shop?.name}</h1>
      </VisuallyHidden>
      <HeroHeader
        hero={hero?.data}
        {...(isMavalaCorporate && {variant: 'full'})}
      />
      <FeaturedCollections data={featuredCollections!} />
      <HotPicks data={hotPicks!} />
      <EditorialSection data={editorialSection!} />
      <FocusCollection data={focusCollection!} />
      {isMavalaFrance && (
        <Suspense>
          <FeaturedArticles relatedArticles={relatedArticles} />
        </Suspense>
      )}
    </>
  );
}

/*  */
/*  */
/*  */
/* Sanity queries */
const heroQuery = groq`
  *[_type == "home"][0] {
    _id,
    _type,
    hero {
      slides[] {
        _key,
        image {
          ${imageFragment}
        },
        medias[] {
          ...,
          _type,
          _type == "image" => {
            ${imageFragment}
          },
          _type == "video" => {
            ${videoFragment}
          },
          _type == "bunnyVideoMedias" => {
            id
          },
        },
        mediasMobile[] {
          ...,
          _type,
          _type == "image" => {
            ${imageFragment}
          },
          _type == "video" => {
            ${videoFragment}
          },
          _type == "bunnyVideoMediasMobile" => {
            id
          },
        },
        "title": coalesce(
          title[_key == $language][0].value,
          title[0].value
        ),
        linkReferences[0] {
          ...,
          _type,
          _type == "link" => {
            ${linkFragment}
          },
          _type == "reference" => {
            "product": @->store.slug.current
          }
        },
        link {
          ${linkFragment}
        },
      }
    }
  }
`;

export const blocksQuery = groq`
  *[_type == "home"][0] {
    _id,
    _type,
    featuredCollections{
      ${collectionsFragment}
    },
    hotPicks{
      ${collectionsFragment}
    },
    editorialSection {
      ${editorialSectionFragment}
    },
    focusCollection{
      ${focusCollectionFragment}
    }
  }
`;

const relatedArticlesQuery = groq`
  *[_type == "home"][0] {
    _id,
    _type,
    relatedArticles[]-> {
      ${articleFragment}
    }
  }
`;

const seoHomeQuery = groq`
  *[_type == "home"][0] {
    _id,
    _type,
    seo {
      ${seoFragment}
    }
  }
`;
