import groq from 'groq';

// @sanity-typegen-ignore
export const collectionsFragment = groq`
  _type,
  _key,
  "title": coalesce(
    title[_key == $language][0].value,
    title[0].value
  ),
  collections[]-> {
    "handle": store.slug.current
  }
`;
