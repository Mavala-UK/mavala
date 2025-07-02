import groq from 'groq';
import { useOutletContext, useLoaderData, type MetaFunction } from 'react-router';
import {getSeoMeta} from '@shopify/hydrogen';
import {type ArticlesQueryResult} from 'sanity.generated';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {RootLoader} from '~/root';
import {PER_PAGE, type BlogLoader} from './_store.($locale).blog';
import {Breadcrumb} from '~/components/common/Breadcrumb';
import {BlogHeader} from '~/components/blog/BlogHeader';
import {ArticleList} from '~/components/blog/ArticleList';
import {articleFragment} from '~/sanity/fragments/articleFragment';

export const meta: MetaFunction<
  typeof loader,
  {root: RootLoader; 'routes/_store.($locale).blog': BlogLoader}
> = ({matches: [root, , , blog]}) => {
  return getSeoMeta(root.data.seo, blog.data?.seo);
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {sanity, storefront, sites} = context;

  if (sites?.isMavalaCorporate) {
    throw new Response(`Blog not found`, {
      status: 404,
    });
  }

  const language = storefront.i18n?.language.toLowerCase();
  const searchParams = new URL(request.url).searchParams;
  const lastPublishedAt = searchParams.get('lastPublishedAt');
  const lastId = searchParams.get('lastId');

  const articles = await sanity.loadQuery<ArticlesQueryResult>(articlesQuery, {
    language,
    lastPublishedAt,
    lastId,
  });

  const hasNextPage = articles.data.length > PER_PAGE;

  if (articles.data.length > PER_PAGE) {
    articles.data = articles.data.slice(0, PER_PAGE);
  }

  return {articles, hasNextPage};
}

export default function Blog() {
  const {blog} =
    useOutletContext<ReturnType<typeof useLoaderData<BlogLoader>>>();

  return (
    <>
      <Breadcrumb items={[{title: blog.data?.title ?? ''}]} />
      <BlogHeader />
      <ArticleList />
    </>
  );
}

const articlesQuery = groq`
  *[
    _type == "article" &&
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
