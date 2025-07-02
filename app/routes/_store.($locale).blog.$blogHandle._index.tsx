import groq from 'groq';
import { useLoaderData, type MetaFunction } from 'react-router';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import imageUrlBuilder from '@sanity/image-url';
import {type SeoConfig, getSeoMeta} from '@shopify/hydrogen';
import {seoFragment} from '~/sanity/fragments/seoFragment';
import {RootLoader} from '~/root';
import {truncate} from '~/lib/utils';
import {type BlogLoader} from './_store.($locale).blog';
import {
  CategoryBlogQueryResult,
  CategoryQueryResult,
  CategoryArticlesQueryResult,
} from 'sanity.generated';
import {Breadcrumb} from '~/components/common/Breadcrumb';
import {BlogHeader} from '~/components/blog/BlogHeader';
import {ArticleList} from '~/components/blog/ArticleList';
import {articleFragment} from '~/sanity/fragments/articleFragment';

export const meta: MetaFunction<
  typeof loader,
  {root: RootLoader; 'routes/_store.($locale).blog': BlogLoader}
> = ({data, matches: [root, , , blog]}) => {
  return getSeoMeta(root.data.seo, blog.data.seo, data?.seo);
};

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {sanity, storefront, sites} = context;

  if (sites?.isMavalaCorporate) {
    throw new Response(`Blog not found`, {
      status: 404,
    });
  }

  const {blogHandle} = params;
  const {language, pathPrefix} = storefront.i18n ?? {};
  const locale = language.toLowerCase();

  const searchParams = new URL(request.url).searchParams;
  const lastPublishedAt = searchParams.get('lastPublishedAt');
  const lastId = searchParams.get('lastId');

  const [blog, category, articles] = await Promise.all([
    sanity.loadQuery<CategoryBlogQueryResult>(categoryBlogQuery, {
      language: locale,
    }),
    sanity.loadQuery<CategoryQueryResult>(categoryQuery, {
      language: locale,
      blogHandle,
    }),
    sanity.loadQuery<CategoryArticlesQueryResult>(categoryArticlesQuery, {
      language: locale,
      blogHandle,
      lastPublishedAt,
      lastId,
    }),
  ]);

  const breadcrumbItems = [
    {
      title: blog.data?.title ?? '',
      pathname: `${pathPrefix}/blog`,
    },
    {
      title: category?.data?.title ?? '',
      pathname: `${pathPrefix}/blog/${category?.data?.slug}`,
    },
  ];

  const builder = imageUrlBuilder({
    projectId: context.env.SANITY_PROJECT_ID,
    dataset: context.env.SANITY_DATASET || 'production',
  });

  const {title, description, image} = category?.data?.seo ?? {};

  const seo = {
    title: title ?? category?.data?.title,
    titleTemplate: title ? '%s' : undefined,
    description: truncate(description ?? ''),
    media: image && {
      url: builder
        .image(image)
        .format('jpg')
        .width(1200)
        .height(630)
        .fit('crop')
        .url(),
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
    ],
  } satisfies SeoConfig;

  return {articles, breadcrumbItems, seo};
}

export default function ArticleCategory() {
  const {breadcrumbItems} = useLoaderData<typeof loader>();

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <BlogHeader />
      <ArticleList />
    </>
  );
}

const categoryBlogQuery = groq`
  *[_type == "blog"][0] {
    _id,
    _type,
    "title": coalesce(
      title[_key == $language][0].value,
      title[0].value
    ),
  }
`;

const categoryQuery = groq`
  *[_type == "articleCategory" && slug.current == $blogHandle][0] {
    _id,
    _type,
    "title": coalesce(
      title[_key == $language][0].value,
      title[0].value
    ),
    "slug": slug.current,
    seo {
      ${seoFragment}
    }
  }
`;

const categoryArticlesQuery = groq`
  *[
    _type == "article" &&
    category->slug.current == $blogHandle &&
    defined(publishedAt) &&
    select(
      (defined($lastPublishedAt) && defined($lastId)) =>
        (publishedAt < $lastPublishedAt) ||
        (publishedAt == $lastPublishedAt && _id < $lastId),
      true
    )
  ] | order(publishedAt desc, _id desc) [0...12 + 1] {
    ${articleFragment}
  }
`;
