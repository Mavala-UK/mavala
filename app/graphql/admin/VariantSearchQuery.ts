/**
 * Admin API query to search variants by title. The Admin API indexes variant
 * titles, unlike the Storefront API product search which only indexes
 * product-level fields. Used as a fallback when the primary product search
 * returns few results, so shade-name searches ("Riga", "Vert Empire")
 * surface the parent product with the matched variant.
 */
export const ADMIN_VARIANT_SEARCH = `#graphql
  query AdminVariantSearch($query: String!) {
    productVariants(first: 10, query: $query) {
      edges {
        node {
          id
          displayName
          product {
            id
            handle
            title
          }
        }
      }
    }
  }
` as const;
