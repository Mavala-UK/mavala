export const ALL_SHOP_POLICIES_QUERY = `#graphql
  query AllShopPolicies {
    shop {
      shopPolicies {
        id
        title
      }
    }
  }
`;

export const SHOP_POLICY_QUERY = `#graphql
  query ShopPolicy($id: ID!, $locale: String!) {
    node(id: $id) {
      ...on ShopPolicy {
        id
        type
        body
        title
        translations(locale: $locale){
          value

        }
      }
    }
  }
` as const;
