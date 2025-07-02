import {PRODUCT_VARIANT_FRAGMENT} from './ProductVariantFragment';
import {PRODUCT_ITEM_FRAGMENT} from './ProductItemFragment';

export const PRODUCT_FRAGMENT = `#graphql
  fragment ImageProduct on Image {
    id
    url
    altText
    width
    height
  }
  fragment Video on Video {
    alt
    previewImage{
      ...ImageProduct
    }
    sources {
      ...VideoSource
    }
  }
  fragment VideoSource on VideoSource {
    url
    mimeType
    width
    format
    height
  }
  fragment MainColor on Product{
    id
    title
    handle
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    mainColor: metafield(namespace: "custom", key: "maincolor") {
      reference {
        ...on Metaobject{
          id
          name: field(key: "name") {
            value
          }
          code: field(key: "code") {
            value
          }
        }
      }
    }
    defaultVariant: metafield(namespace: "custom", key: "default_variant") {
      reference {
        ...ProductVariant
      }
    }
  }
  fragment Product on Product {
    id
    title
    productType
    vendor
    handle
    description
    featuredImage {
      ...ImageProduct
    }
    media(first: 100) {
      nodes {
        id
        mediaContentType
        ... on MediaImage {
          image {
            ...ImageProduct
          }
        }
        ...Video
      }
    }
    options {
      name
      optionValues {
        name
      }
    }
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    canonicalCollection: metafield(namespace: "custom", key: "canonical_collection") {
      reference {
        ... on Collection {
          handle
          title
          parentCollection: metafield(namespace: "custom", key: "parent_collection") {
            reference {
              ... on Collection {
                handle
                title
                parentCollection: metafield(namespace: "custom", key: "parent_collection") {
                  reference {
                    ... on Collection {
                      handle
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    canonicalProduct: metafield(namespace: "custom", key: "canonical_product") {
      reference {
        ... on Product {
          handle
          title
        }
      }
    }
    defaultVariant: metafield(namespace: "custom", key: "default_variant") {
      reference {
        ...ProductVariant
      }
    }
    badges: metafield(namespace: "custom", key: "badges") {
      references(first: 2) {
        nodes {
          ...on Metaobject{
            id
            text: field(key: "text") {
              value
            }
          }
        }
      }
    }
    capacity: metafield(namespace: "custom", key: "capacity") {
      value
    }
    reassurances: metafield(namespace: "custom", key: "reassurances") {
      references(first: 3) {
        nodes {
          ...on Metaobject {
            id
            text: field(key: "text") {
              value
            }
          }
        }
      }
    }
    mainColor: metafield(namespace: "custom", key: "maincolor") {
      reference {
        ...on Metaobject{
          id
          name: field(key: "name") {
            value
          }
          code: field(key: "code") {
            value
          }
        }
      }
    }
    associatedProducts: metafield(namespace: "custom", key: "associated_products") {
      references(first: 20) {
        nodes {
          ...on Product{
            ...MainColor
          }
        }
      }
    }
    favoriteShades: metafield(namespace: "custom", key: "favorite_shades") {
      references(first: 6) {
        nodes {
          ...ProductVariant
        }
      }
    }
    complementaryProducts: metafield(
      namespace: "shopify--discovery--product_recommendation"
      key: "complementary_products"
    ) {
      value
      references(first: 10) {
        nodes {
          ...ProductItem
        }
      }
    }
    accordions: metafield(namespace: "custom", key: "accordions") {
      references(first: 10) {
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
    videoSection: metafield(namespace: "custom", key: "video_section") {
      reference {
        ...on Metaobject{
          id
          type
          title: field(key: "title") {
            value
          }
          text: field(key: "text") {
            value
          }
          file: field(key: "file") {
            reference{
              ...Video
            }
          }
        }
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
