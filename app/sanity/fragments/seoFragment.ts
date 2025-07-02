import groq from 'groq';
import {imageFragment} from './imageFragment';

// @sanity-typegen-ignore
export const seoFragment = groq`
  "title": coalesce(
    title[_key == $language][0].value,
    title[0].value
  ),
  "description": coalesce(
    description[_key == $language][0].value,
    description[0].value
  ),
  "image": coalesce(
    image[_key == $language][0].value{
      ${imageFragment}
    },
    image[0].value{
      ${imageFragment}
    }
  )
`;
