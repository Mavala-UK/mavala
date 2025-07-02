// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    cost {
      totalAmount {
        ...Money
      }
      subtotalAmount {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        quantityAvailable
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          ...on Product{
            id
            handle
            title
            productType
            vendor
            collections(first: 10) {
              nodes {
                id
                title
                handle
              }
            }
          }
        }
        selectedOptions {
          name
          value
        }
      }
    }
    discountAllocations {
      ... on CartAutomaticDiscountAllocation {
        title
        discountedAmount {
          ...Money
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    updatedAt
    id
    checkoutUrl
    totalQuantity
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
    }
  }
` as const;
