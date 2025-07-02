import groq from 'groq';
import {imageFragment} from './imageFragment';

// @sanity-typegen-ignore
export const articleFragment = groq`
  _id,
  "title": coalesce(
    title[_key == $language][0].value,
    title[0].value
  ),
  "slug": slug.current,
  publishedAt,
  category-> {
    "title": coalesce(
      title[_key == $language][0].value,
      title[0].value
    ),
    "slug": slug.current
  },
  image {
    ${imageFragment}
  }
`;
