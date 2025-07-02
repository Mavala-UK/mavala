import groq from 'groq';

// @sanity-typegen-ignore
export const videoFragment = groq`
  ...,
  "file": coalesce(
    file[_key == $language][0].value{
      asset-> {
        url,
        mimeType
      },
    },
    file[0].value{
      asset-> {
        url,
        mimeType
      },
    }
  ),
  "poster": coalesce(
    poster[_key == $language][0].value{
      asset-> {
        url,
      },
    },
    poster[0].value{
      asset-> {
        url
      },
    }
  )
`;
