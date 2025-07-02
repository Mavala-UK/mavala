export const AUTOMATIC_DISCOUNTS_QUERY = /* GraphQL */ `
  query AutomaticDiscounts {
    automaticDiscountNodes(first: 100) {
      nodes {
        automaticDiscount {
          __typename
          ... on DiscountAutomaticFreeShipping {
            title
            minimumRequirement {
              ... on DiscountMinimumSubtotal {
                greaterThanOrEqualToSubtotal {
                  amount
                  currencyCode
                }
              }
            }
          }
          ... on DiscountAutomaticBxgy {
            title
            startsAt
            endsAt
            status
            customerBuys {
              value {
                ... on DiscountQuantity {
                  __typename
                  quantity
                }
                ... on DiscountPurchaseAmount {
                  __typename
                  amount
                }
              }
              items {
                __typename
                ... on AllDiscountItems {
                  allItems
                }
                ... on DiscountCollections {
                  collections(first: 20) {
                    nodes {
                      id
                    }
                  }
                }
                ... on DiscountProducts {
                  products(first: 20) {
                    nodes {
                      id
                    }
                  }
                  productVariants(first: 100) {
                    nodes {
                      id
                    }
                  }
                }
              }
            }
            customerGets {
              __typename
              value {
                ... on DiscountOnQuantity {
                  quantity {
                    quantity
                  }
                  effect {
                    ... on DiscountAmount {
                      __typename
                      amount {
                        amount
                        currencyCode
                      }
                    }
                    ... on DiscountPercentage {
                      __typename
                      percentage
                    }
                  }
                }
              }
              items {
                ... on DiscountCollections {
                  __typename
                  collections(first: 20) {
                    nodes {
                      __typename
                      id
                      handle
                    }
                  }
                }
                ... on DiscountProducts {
                  __typename
                  products(first: 20) {
                    nodes {
                      __typename
                      id
                      handle
                    }
                  }
                  productVariants(first: 100) {
                    nodes {
                      __typename
                      id
                      title
                      product {
                        handle
                        id
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
    }
  }
`;
