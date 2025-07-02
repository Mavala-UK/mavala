/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontTypes from './storefront.types';

export type CustomerEmailMarketingSubscribeMutationVariables = StorefrontTypes.Exact<{
  email: StorefrontTypes.Scalars['String']['input'];
}>;


export type CustomerEmailMarketingSubscribeMutation = { customerEmailMarketingSubscribe?: StorefrontTypes.Maybe<{ customerUserErrors: Array<Pick<StorefrontTypes.CustomerUserError, 'message'>> }> };

interface GeneratedQueryTypes {
}

interface GeneratedMutationTypes {
  "#graphql\n  mutation customerEmailMarketingSubscribe($email: String!) {\n    customerEmailMarketingSubscribe(email: $email) {\n      customerUserErrors {\n        message\n      }\n    }\n  }\n": {return: CustomerEmailMarketingSubscribeMutation, variables: CustomerEmailMarketingSubscribeMutationVariables},
}
declare module '@shopify/storefront-api-client' {
  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
