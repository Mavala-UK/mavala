/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type AutomaticDiscountsQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type AutomaticDiscountsQuery = { automaticDiscountNodes: { nodes: Array<{ automaticDiscount: { __typename: 'DiscountAutomaticApp' | 'DiscountAutomaticBasic' } | (
        { __typename: 'DiscountAutomaticBxgy' }
        & Pick<AdminTypes.DiscountAutomaticBxgy, 'title' | 'startsAt' | 'endsAt' | 'status'>
        & { customerBuys: { value: (
            { __typename: 'DiscountPurchaseAmount' }
            & Pick<AdminTypes.DiscountPurchaseAmount, 'amount'>
          ) | (
            { __typename: 'DiscountQuantity' }
            & Pick<AdminTypes.DiscountQuantity, 'quantity'>
          ), items: (
            { __typename: 'AllDiscountItems' }
            & Pick<AdminTypes.AllDiscountItems, 'allItems'>
          ) | (
            { __typename: 'DiscountCollections' }
            & { collections: { nodes: Array<Pick<AdminTypes.Collection, 'id'>> } }
          ) | (
            { __typename: 'DiscountProducts' }
            & { products: { nodes: Array<Pick<AdminTypes.Product, 'id'>> }, productVariants: { nodes: Array<Pick<AdminTypes.ProductVariant, 'id'>> } }
          ) }, customerGets: (
          { __typename: 'DiscountCustomerGets' }
          & { value: { quantity: Pick<AdminTypes.DiscountQuantity, 'quantity'>, effect: (
              { __typename: 'DiscountAmount' }
              & { amount: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }
            ) | (
              { __typename: 'DiscountPercentage' }
              & Pick<AdminTypes.DiscountPercentage, 'percentage'>
            ) }, items: (
            { __typename: 'DiscountCollections' }
            & { collections: { nodes: Array<(
                { __typename: 'Collection' }
                & Pick<AdminTypes.Collection, 'id' | 'handle'>
              )> } }
          ) | (
            { __typename: 'DiscountProducts' }
            & { products: { nodes: Array<(
                { __typename: 'Product' }
                & Pick<AdminTypes.Product, 'id' | 'handle'>
              )> }, productVariants: { nodes: Array<(
                { __typename: 'ProductVariant' }
                & Pick<AdminTypes.ProductVariant, 'id' | 'title'>
                & { product: Pick<AdminTypes.Product, 'handle' | 'id' | 'title'> }
              )> } }
          ) }
        ) }
      ) | (
        { __typename: 'DiscountAutomaticFreeShipping' }
        & Pick<AdminTypes.DiscountAutomaticFreeShipping, 'title'>
        & { minimumRequirement?: AdminTypes.Maybe<{ greaterThanOrEqualToSubtotal: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }> }
      ) }> } };

export type AllShopPoliciesQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type AllShopPoliciesQuery = { shop: { shopPolicies: Array<Pick<AdminTypes.ShopPolicy, 'id' | 'title'>> } };

export type ShopPolicyQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  locale: AdminTypes.Scalars['String']['input'];
}>;


export type ShopPolicyQuery = { node?: AdminTypes.Maybe<(
    Pick<AdminTypes.ShopPolicy, 'id' | 'type' | 'body' | 'title'>
    & { translations: Array<Pick<AdminTypes.Translation, 'value'>> }
  )> };

interface GeneratedQueryTypes {
  "\n  query AutomaticDiscounts {\n    automaticDiscountNodes(first: 100) {\n      nodes {\n        automaticDiscount {\n          __typename\n          ... on DiscountAutomaticFreeShipping {\n            title\n            minimumRequirement {\n              ... on DiscountMinimumSubtotal {\n                greaterThanOrEqualToSubtotal {\n                  amount\n                  currencyCode\n                }\n              }\n            }\n          }\n          ... on DiscountAutomaticBxgy {\n            title\n            startsAt\n            endsAt\n            status\n            customerBuys {\n              value {\n                ... on DiscountQuantity {\n                  __typename\n                  quantity\n                }\n                ... on DiscountPurchaseAmount {\n                  __typename\n                  amount\n                }\n              }\n              items {\n                __typename\n                ... on AllDiscountItems {\n                  allItems\n                }\n                ... on DiscountCollections {\n                  collections(first: 20) {\n                    nodes {\n                      id\n                    }\n                  }\n                }\n                ... on DiscountProducts {\n                  products(first: 20) {\n                    nodes {\n                      id\n                    }\n                  }\n                  productVariants(first: 100) {\n                    nodes {\n                      id\n                    }\n                  }\n                }\n              }\n            }\n            customerGets {\n              __typename\n              value {\n                ... on DiscountOnQuantity {\n                  quantity {\n                    quantity\n                  }\n                  effect {\n                    ... on DiscountAmount {\n                      __typename\n                      amount {\n                        amount\n                        currencyCode\n                      }\n                    }\n                    ... on DiscountPercentage {\n                      __typename\n                      percentage\n                    }\n                  }\n                }\n              }\n              items {\n                ... on DiscountCollections {\n                  __typename\n                  collections(first: 20) {\n                    nodes {\n                      __typename\n                      id\n                      handle\n                    }\n                  }\n                }\n                ... on DiscountProducts {\n                  __typename\n                  products(first: 20) {\n                    nodes {\n                      __typename\n                      id\n                      handle\n                    }\n                  }\n                  productVariants(first: 100) {\n                    nodes {\n                      __typename\n                      id\n                      title\n                      product {\n                        handle\n                        id\n                        title\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": {return: AutomaticDiscountsQuery, variables: AutomaticDiscountsQueryVariables},
  "#graphql\n  query AllShopPolicies {\n    shop {\n      shopPolicies {\n        id\n        title\n      }\n    }\n  }\n": {return: AllShopPoliciesQuery, variables: AllShopPoliciesQueryVariables},
  "#graphql\n  query ShopPolicy($id: ID!, $locale: String!) {\n    node(id: $id) {\n      ...on ShopPolicy {\n        id\n        type\n        body\n        title\n        translations(locale: $locale){\n          value\n\n        }\n      }\n    }\n  }\n": {return: ShopPolicyQuery, variables: ShopPolicyQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
