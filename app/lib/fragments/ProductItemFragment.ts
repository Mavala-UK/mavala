export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment Image on Image {
    id
    url
    altText
    width
    height
  }
  fragment ProductVariantItem on ProductVariant {
    id
    title
    image {
      ...Image
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    availableForSale
    selectedOptions {
      name
      value
    }
    tint: metafield(namespace: "custom", key: "tint") {
      reference {
        ...on Metaobject{
          color: field(key: "color") {
            value
          }
        }
      }
    }
  }
  fragment ProductItem on Product {
    id
    handle
    title
    vendor
    productType
    featuredImage {
      ...Image
    }
    variants(first: 250) {
      nodes {
        ...ProductVariantItem
      }
    }
    defaultVariant: metafield(namespace: "custom", key: "default_variant") {
      reference {
        ... on ProductVariant {
          id
        }
      }
    }
    capacity: metafield(namespace: "custom", key: "capacity") {
      value
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
  }
` as const;
