// NOTE: https://shopify.dev/docs/api/customer/latest/queries/order
export const CUSTOMER_ORDER_QUERY = `#graphql
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment DiscountApplication on DiscountApplication {
    allocationMethod
    targetSelection
    targetType
    value {
      __typename
      ... on MoneyV2 {
        ...OrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment OrderLineItemFull on LineItem {
    id
    title
    quantity
    variantTitle
    price {
      ...OrderMoney
    }
    totalDiscount {
      ...OrderMoney
    }
    totalPrice {
      ...OrderMoney
    }
    discountAllocations {
      allocatedAmount {
        ...OrderMoney
      }
      discountApplication {
        ...DiscountApplication
      }
    }
  }
  fragment Order on Order {
    id
    name
    processedAt
    lineItems(first: 100) {
      nodes {
        ...OrderLineItemFull
      }
    }
    subtotal {
      ...OrderMoney
    }

    totalTax {
      ...OrderMoney
    }
    totalShipping {
      ...OrderMoney
    }
    totalPrice {
      ...OrderMoney
    }
    billingAddress {
      id
      name
      formatted
      formattedArea
    }
    shippingAddress {
      id
      name
      formatted
      formattedArea
    }
    shippingDiscountAllocations{
      allocatedAmount {
        ...OrderMoney
      }
      discountApplication{
        ...DiscountApplication
      }
    }
    discountApplications(first: 100) {
      nodes {
        ...DiscountApplication
      }
    }
  }
  query Order($orderId: ID!) {
    order(id: $orderId) {
      ... on Order {
        ...Order
      }
    }
  }
` as const;
