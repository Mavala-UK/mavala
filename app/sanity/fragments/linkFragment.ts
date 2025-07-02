import groq from 'groq';

// @sanity-typegen-ignore
export const linkFragment = groq`
  type,
  "url": select(
    page->_type == "collection" => "/collections/" + page->store.slug.current,
    page->_type == "home" => "/",
    page->_type == "product" => "/products/" + page->store.slug.current,
    // page->_type == "article" => "/articles/" + page->slug.current,
    page->_type == "page" => "/pages/" + page->slug.current,
    url
  ),
  email,
  "text": coalesce(
      text[_key == $language][0].value,
      text[0].value
    )
`;
