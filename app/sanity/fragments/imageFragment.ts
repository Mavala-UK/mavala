import groq from 'groq';

// @sanity-typegen-ignore
export const imageFragment = groq`
  ...,
  asset-> {
    _id,
    altText
  }
`;
