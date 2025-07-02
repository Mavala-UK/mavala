import groq from 'groq';

// @sanity-typegen-ignore
export const focusCollectionFragment = groq`
  _type,
  _key,
  collection-> {
    "handle": store.slug.current
  }
`;
