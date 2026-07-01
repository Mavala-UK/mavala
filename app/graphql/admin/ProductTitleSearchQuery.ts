/**
 * Admin API query to search products by title. The Admin API indexes product
 * titles with wildcard support, unlike the Storefront API search which uses
 * relevance-based ranking. Used as a third-tier fallback when both the primary
 * Storefront search and the Admin variant search return zero results, so that
 * partial product-name matches ("lumi" for "Crayon Lumiere") surface the
 * correct product.
 */
export const ADMIN_PRODUCT_TITLE_SEARCH = `#graphql
  query AdminProductTitleSearch($query: String!) {
    products(first: 10, query: $query) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
  }
` as const;
