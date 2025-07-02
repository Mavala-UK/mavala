import groq from 'groq';
import {use, Suspense} from 'react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from 'react-router';
import {truncate} from '~/lib/utils';
import {
  ArticleQueryResult,
  ArticleBlogQueryResult,
  RelatedArticlesBlogQueryResult,
} from 'sanity.generated';
import imageUrlBuilder from '@sanity/image-url';
import type {BlogLoader} from './_store.($locale).blog';
import {RootLoader} from '~/root';
import {getSeoMeta, type SeoConfig} from '@shopify/hydrogen';
import {seoFragment} from '~/sanity/fragments/seoFragment';
import {imageFragment} from '~/sanity/fragments/imageFragment';
import {articleFragment} from '~/sanity/fragments/articleFragment';
import {Breadcrumb} from '~/components/common/Breadcrumb';
import {FeaturedArticles} from '~/components/blog/FeaturedArticles';
import {ArticleMain} from '~/components/blog/ArticleMain';
import {portableTextFragment} from '~/sanity/fragments/portableTextFragment';

export const meta: MetaFunction<
  typeof loader,
  {root: RootLoader; 'routes/_store.($locale).blog': BlogLoader}
> = ({data, matches: [root, , , blog]}) => {
  return getSeoMeta(root.data.seo, blog.data.seo, data?.seo);
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
  const {sanity, storefront, sites} = context;

  if (sites?.isMavalaCorporate) {
    throw new Response(`Blog not found`, {
      status: 404,
    });
  }

  const {blogHandle, articleHandle} = params;
  const {language, pathPrefix} = storefront.i18n ?? {};
  const locale = language.toLowerCase();

  if (!blogHandle || !articleHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [article, blog] = await Promise.all([
    sanity.loadQuery<ArticleQueryResult>(articleQuery, {
      language: locale,
      blogHandle,
      articleHandle,
    }),
    sanity.loadQuery<ArticleBlogQueryResult>(articleBlogQuery, {
      language: locale,
    }),
  ]);

  const {
    title: articleTitle,
    intro: description,
    image: articleImage,
    category,
    _updatedAt: updatedAt,
    publishedAt,
  } = article?.data ?? {};
  const {title: categoryTitle, slug: categorySlug} = category ?? {};

  const breadcrumbItems = [
    {
      title: blog.data?.title ?? '',
      pathname: `${pathPrefix}/blog`,
    },
    {
      title: categoryTitle ?? '',
      pathname: `${pathPrefix}/blog/${categorySlug}`,
    },
    {title: articleTitle ?? ''},
  ];

  const builder = imageUrlBuilder({
    projectId: context.env.SANITY_PROJECT_ID,
    dataset: context.env.SANITY_DATASET || 'production',
  });

  const {
    title: seoTitle,
    description: seoDescription,
    image: seoImage,
  } = article?.data?.seo ?? {};

  const image = seoImage ?? articleImage;

  const seoImageUrl = seoImage
    ? builder
        .image(seoImage)
        .format('jpg')
        .width(1200)
        .height(630)
        .fit('crop')
        .url()
    : undefined;

  const seo = {
    title: seoTitle ?? articleTitle,
    titleTemplate: seoTitle ? '%s' : undefined,
    description: truncate(seoDescription ?? description ?? ''),
    media: image && {
      url: seoImageUrl,
      type: 'image',
      width: 1200,
      height: 630,
      altText: image?.asset?.altText,
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
        '@type': 'Article',
        headline: seoTitle,
        description: seoDescription,
        datePublished: publishedAt ?? undefined,
        dateModified: updatedAt,
        image: seoImageUrl,
        url: request.url,
      },
    ],
  } satisfies SeoConfig;

  return {article, breadcrumbItems, seo};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  const {sanity, storefront} = context;
  const {blogHandle, articleHandle} = params;
  const language = storefront.i18n?.language.toLowerCase();

  if (!blogHandle) {
    throw new Error('Missing category slug');
  }

  const relatedArticles = sanity.loadQuery<RelatedArticlesBlogQueryResult>(
    relatedArticlesBlogQuery,
    {
      language,
      blogHandle,
      articleHandle,
    },
  );

  return {relatedArticles};
}

export default function Article() {
  const {breadcrumbItems, relatedArticles: relatedArticlesPromise} =
    useLoaderData<typeof loader>();
  const relatedArticles = use(relatedArticlesPromise).data ?? {};

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <ArticleMain />
      <Suspense>
        <FeaturedArticles relatedArticles={relatedArticles} />
      </Suspense>
    </>
  );
}

const articleBlogQuery = groq`
  *[_type == "blog"][0] {
    _id,
    _type,
    "title": coalesce(
      title[_key == $language][0].value,
      title[0].value
    ),
  }
`;

const articleQuery = groq`
  *[_type == "article" && slug.current == $articleHandle && category->slug.current == $blogHandle][0] {
    _id,
    _type,
    _updatedAt,
    publishedAt,
    category-> {
      "title": coalesce(
        title[_key == $language][0].value,
        title[0].value
      ),
      "slug": slug.current
    },
    "title": coalesce(
      title[_key == $language][0].value,
      title[0].value
    ),
    "intro": coalesce(
      intro[_key == $language][0].value,
      intro[0].value
    ),
    image {
      ${imageFragment}
    },
    sections[] {
      _key,
      _type,
      "title": coalesce(
        title[_key == $language][0].value,
        title[0].value
      ),
      "content": coalesce(
          content[_key == $language][0].value,
          content[0].value
        )[] {
        ${portableTextFragment}
      },
    },
    relatedCategories[]-> {
      "handle": store.slug.current
    },
    seo {
      ${seoFragment}
    }
  }
`;

const relatedArticlesBlogQuery = groq`
  *[_type == "article" && category->slug.current == $blogHandle && slug.current != $articleHandle][0...3] {
    ${articleFragment}
  }
`;
