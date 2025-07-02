import groq from 'groq';
import {defineDocuments} from 'sanity/presentation';

export const mainDocuments = defineDocuments([
  {
    route: '/',
    filter: groq`_type == "home"`,
  },
  {
    route: '/pages/:slug',
    filter: groq`_type == "page" && slug.current == $slug`,
  },
  {
    route: '/blog',
    filter: groq`_type == "blog"`,
  },
  {
    route: '/blog/:blogHandle',
    filter: groq`_type == "articleCategory" && slug.current == $blogHandle`,
  },
  {
    route: '/blog/:blogHandle/:articleHandle',
    filter: groq`_type == "article" && category->slug.current == $blogHandle && slug.current == $articleHandle`,
  },
  {
    route: '/products/:slug',
    filter: groq`_type == "product" && store.slug.current == $slug`,
  },
  {
    route: '/collections/:slug',
    filter: groq`_type == "collection" && store.slug.current == $slug`,
  },
]);
