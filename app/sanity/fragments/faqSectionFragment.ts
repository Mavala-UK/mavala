import groq from 'groq';
import {portableTextFragment} from './portableTextFragment';

// @sanity-typegen-ignore
export const faqSectionFragment = groq`
  _id,
  _type,
  faqSection {
    questions[] {
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
      }
    }
  }
`;
