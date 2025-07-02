import {use, Suspense} from 'react';
import groq from 'groq';
import imageUrlBuilder from '@sanity/image-url';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {SeoConfig} from '@shopify/hydrogen';
import type {RootLoader} from '~/root';
import {getSeoMeta} from '@shopify/hydrogen';
import type {
  PageQueryResult,
  PageRelatedArticlesQueryResult,
} from 'sanity.generated';
import {truncate} from '~/lib/utils';
import { useRouteLoaderData, Await, useLoaderData, type MetaFunction } from 'react-router';
import {FeaturedArticles} from '~/components/blog/FeaturedArticles';
import {articleFragment} from '~/sanity/fragments/articleFragment';
import {portableTextFragment} from '~/sanity/fragments/portableTextFragment';
import {seoFragment} from '~/sanity/fragments/seoFragment';
import {Breadcrumb} from '~/components/common/Breadcrumb';
import {PageContent} from '~/components/page/PageContent';

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

  return {
    ...deferredData,
    ...criticalData,
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    throw new Error('Missing page handle');
  }

  const {storefront, sanity} = context;
  const language = storefront.i18n?.language.toLowerCase();

  const page = await sanity.loadQuery<PageQueryResult>(pageQuery, {
    slug: handle,
    language,
  });

  if (!page.data) {
    throw new Response('Page not found', {status: 404});
  }

  const {seo: seoData, title, introTitle, introDescription} = page.data ?? {};
  const {
    title: seoTitle,
    description: seoDescription,
    image: seoImage,
  } = seoData ?? {};

  const builder = imageUrlBuilder({
    projectId: context.env.SANITY_PROJECT_ID,
    dataset: context.env.SANITY_DATASET || 'production',
  });

  const seo = {
    title: seoTitle ?? title ?? introTitle,
    titleTemplate: seoTitle ? '%s' : undefined,
    description: truncate(
      seoDescription ?? `${introTitle} ${introDescription}`,
    ),
    media: seoImage && {
      url: builder
        .image(seoImage)
        .format('jpg')
        .width(1200)
        .height(630)
        .fit('crop')
        .url(),
      type: 'image',
      width: 1200,
      height: 630,
      altText: seoImage?.alt,
    },
  } satisfies SeoConfig;

  return {
    page,
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
    throw new Error('Missing page handle');
  }

  const {storefront, sanity} = context;
  const language = storefront.i18n?.language.toLowerCase();

  const relatedArticles = sanity.loadQuery<PageRelatedArticlesQueryResult>(
    pageRelatedArticlesQuery,
    {
      language,
      slug: handle,
    },
  );

  return {relatedArticles};
}

export default function Page() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {isMavalaFrance} = data?.sites ?? {};
  const {page, relatedArticles: relatedArticlesPromise} =
    useLoaderData<typeof loader>();
  const {relatedArticles} = use(relatedArticlesPromise).data ?? {};

  return (
    <>
      <Breadcrumb items={[{title: page.data?.title ?? ''}]} />
      <PageContent page={page.data} />
      {isMavalaFrance && (
        <Suspense>
          <FeaturedArticles relatedArticles={relatedArticles} />
        </Suspense>
      )}
    </>
  );
}

const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    "title": coalesce(
      title[_key == $language][0].value,
      title[0].value
    ),
    "introTitle": coalesce(
      introTitle[_key == $language][0].value,
      introTitle[0].value
    ),
    "introDescription": coalesce(
      introDescription[_key == $language][0].value,
      introDescription[0].value
    ),
    "content": coalesce(
      content[_key == $language][0].value,
      content[0].value
    )[] {
      ${portableTextFragment}
    },
    seo {
      ${seoFragment}
    }
  }
`;

const pageRelatedArticlesQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    relatedArticles[]-> {
      ${articleFragment}
    }
  }
`;
