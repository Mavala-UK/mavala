export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ImageProductVariant on Image{
    id
    url
    altText
    width
    height
  }
  fragment VideoSourceVariant on VideoSource {
    url
    mimeType
    width
    format
    height
  }
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      ...ImageProductVariant
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      productType
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    barcode
    title
    unitPrice {
      amount
      currencyCode
    }
    tint: metafield(namespace: "custom", key: "tint") {
      reference {
        ...on Metaobject{
          name: field(key: "name") {
            value
          }
          color: field(key: "color") {
            value
          }
          image: field(key: "image") {
            reference{
              ... on MediaImage{
                id
                mediaContentType
                image{
                  ...ImageProductVariant
                }
              }
            }
          }
        }
      }
    }
    textureImg: metafield(namespace: "custom", key: "texture_img") {
      reference{
        ... on MediaImage {
          id
          mediaContentType
          image {
            ...ImageProductVariant
          }
        }
      }
    }
    galleryMedias: metafield(namespace: "custom", key: "gallery_medias") {
      references(first: 100) {
        nodes {
          ... on MediaImage {
            id
            mediaContentType
            image {
              ...ImageProductVariant
            }
          }
          ... on Video {
            alt
            mediaContentType
            previewImage{
              ...ImageProductVariant
            }
            sources {
              ...VideoSourceVariant
            }
          }
        }
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
    finish: metafield(namespace: "custom", key: "finish") {
      value
    }
    protector: metafield(namespace: "custom", key: "protector") {
      value
    }
    accordion: metafield(namespace: "custom", key: "accordion") {
      reference {
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
` as const;
