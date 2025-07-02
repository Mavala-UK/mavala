import groq from 'groq';
import { Outlet, useLoaderData, type MetaFunction } from 'react-router';
import imageUrlBuilder from '@sanity/image-url';
import {truncate} from '~/lib/utils';
import {RootLoader} from '~/root';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSeoMeta, type SeoConfig} from '@shopify/hydrogen';
import {seoFragment} from '~/sanity/fragments/seoFragment';
import {
  BlogQueryResult,
  ArticleCategoriesQueryResult,
  AllArticlesQueryResult,
} from 'sanity.generated';

export type BlogLoader = typeof loader;

export const PER_PAGE = 12;

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  data,
  matches: [root],
}) => {
  return getSeoMeta(root.data.seo, data?.seo);
};

export async function loader({context}: LoaderFunctionArgs) {
  const {sanity, storefront, sites} = context;

  if (sites?.isMavalaCorporate) {
    throw new Response(`Blog not found`, {
      status: 404,
    });
  }

  const language = storefront.i18n?.language.toLowerCase();

  const [blog, articleCategories, allArticles] = await Promise.all([
    sanity.loadQuery<BlogQueryResult>(blogQuery, {
      language,
    }),
    sanity.loadQuery<ArticleCategoriesQueryResult>(articleCategoriesQuery, {
      language,
    }),
    sanity.loadQuery<AllArticlesQueryResult>(allArticlesQuery),
  ]);

  const builder = imageUrlBuilder({
    projectId: context.env.SANITY_PROJECT_ID,
    dataset: context.env.SANITY_DATASET || 'production',
  });

  const {title, description, image} = blog?.data?.seo ?? {};

  const seo = {
    title: title ?? blog?.data?.title,
    titleTemplate: blog.data?.seo?.title ? '%s' : undefined,
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
  } satisfies SeoConfig;

  return {blog, articleCategories, allArticles, seo};
}

export default function BlogLayout() {
  const data = useLoaderData<typeof loader>();

  return <Outlet context={data} />;
}

const blogQuery = groq`
  *[_type == "blog"][0] {
    _id,
    _type,
    "title": coalesce(
      title[_key == $language][0].value,
      title[0].value
    ),
    "intro": coalesce(
      intro[_key == $language][0].value,
      intro[0].value
    ),
    seo {
      ${seoFragment}
    }
  }
`;

const articleCategoriesQuery = groq`
  *[_type == "articleCategory"] | order(title asc) {
    _id,
    _type,
    "title": coalesce(
      title[_key == $language][0].value,
      title[0].value
    ),
    "slug": slug.current
  }
`;

const allArticlesQuery = groq`
  *[_type == "article"] {
    category-> {
      "slug": slug.current
    },
  }
`;
