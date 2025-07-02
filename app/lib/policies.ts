import {
  ALL_SHOP_POLICIES_QUERY,
  SHOP_POLICY_QUERY,
} from '~/graphql/admin/ShopPoliciesQueries';
import {slugify} from './utils';
import {type AppLoadContext} from '@shopify/remix-oxygen';

export async function getPolicyByHandle(
  context: AppLoadContext,
  handle: string,
) {
  const {storefront, admin} = context;
  const language = storefront.i18n?.language.toLowerCase();
  const {data: policies} = await admin.request(ALL_SHOP_POLICIES_QUERY);

  const id = policies?.shop.shopPolicies.find(
    (policy) => slugify(policy.title) === handle,
  )?.id;

  if (!id) {
    throw new Response('Could not find the policy', {status: 404});
  }

  const {data: policy} = await admin.request(SHOP_POLICY_QUERY, {
    variables: {id, locale: language},
    headers: {
      'Accept-language': language,
    },
  });

  if (!policy?.node) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return policy.node;
}
