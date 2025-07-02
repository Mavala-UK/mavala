import groq from 'groq';
import {imageFragment} from './imageFragment';
import {linkFragment} from './linkFragment';
import {portableTextFragment} from './portableTextFragment';

// @sanity-typegen-ignore
export const editorialSectionFragment = groq`
  _type,
  _key,
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
  link {
    ${linkFragment}
  },
  image {
    ${imageFragment}
  },
  imagePosition
`;
