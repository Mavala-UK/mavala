// https://shopify.dev/docs/api/customer/latest/objects/Order
export const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    name
    id
    number
    processedAt
    financialStatus
    fulfillments(first: 1) {
      nodes {
        status
        latestShipmentStatus
        trackingInformation {
          number
          url
        }
      }
    }
    totalPrice {
      amount
      currencyCode
    }
  }
` as const;

// https://shopify.dev/docs/api/customer/latest/objects/Customer
export const CUSTOMER_ORDERS_FRAGMENT = `#graphql
  fragment CustomerOrders on Customer {
    orders(sortKey: PROCESSED_AT, reverse: true, first: 250) {
      nodes {
        ...OrderItem
      }
    }
  }
  ${ORDER_ITEM_FRAGMENT}
` as const;

// https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_ORDERS_QUERY = `#graphql
  ${CUSTOMER_ORDERS_FRAGMENT}
  query CustomerOrders {
    customer {
      ...CustomerOrders
    }
  }
` as const;
