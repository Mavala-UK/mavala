import {PRODUCT_ITEM_FRAGMENT} from '../fragments/ProductItemFragment';

/* Shop query */
export const SHOP_QUERY = `#graphql
fragment Image on Image {
    id
    url
    altText
    width
    height
  }
  query Shop(
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    shop {
      id
      name
      description
      primaryDomain {
        url
      }
      brand {
        shortDescription
        logo {
          image {
            ...Image
          }
        }
        coverImage {
          image {
            ...Image
          }
        }
      }
      paymentSettings {
        currencyCode
      }
    }
  }
` as const;

/* Global query */
export const GLOBAL_QUERY = `#graphql
  query Global(
    $language: LanguageCode
    $country: CountryCode
    $handle: MetaobjectHandleInput!
  ) @inContext(language: $language, country: $country) {
    global: metaobject(handle: $handle) {
      announcements: field(key: "announcements") {
        references(first: 10) {
          nodes {
            ... on Metaobject {
              id
              title: field(key: "title") {
                value
              }
              link: field(key: "link") {
                value
              }
            }
          }
        }
      }
      ctas: field(key: "ctas") {
        references(first: 2) {
          nodes {
            ... on Metaobject {
              id
              picto: field(key: "picto") {
                reference {
                  ... on MediaImage {
                    image {
                      id
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
              title: field(key: "title") {
                value
              }
              text: field(key: "text") {
                value
              }
              link: field(key: "link") {
                reference {
                  ... on Metaobject {
                    text: field(key: "text") {
                        value
                    }
                    url: field(key: "url") {
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
      reassurances: field(key: "reassurances") {
        references(first: 3) {
          nodes {
            ... on Metaobject {
              id
              title: field(key: "title") {
                value
              }
              text: field(key: "text") {
                value
              }
            }
          }
        }
      }
      newsletter: field(key: "newsletter") {
        reference {
          ... on Metaobject {
            title: field(key: "title") {
              value
            }
            subtitle: field(key: "subtitle") {
              value
            }
          }
        }
      }
      relatedProductsEmptyCard: field(key: "related_products_empty_card") {
        references(first: 10) {
          nodes{
            ...ProductItem
          }
        }
      }
      relatedProductsAccount: field(key: "related_products_account") {
        references(first: 10) {
          nodes{
            ...ProductItem
          }
        }
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
