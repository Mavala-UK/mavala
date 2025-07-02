import {
  data as remixData,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import { useRouteLoaderData } from 'react-router';
import {RootLoader} from '~/root';
import {RelatedProducts} from '~/components/product/RelatedProducts';
import {AccountMain} from '~/components/account/AccountMain';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: LoaderFunctionArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY);

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {sites, global} = data ?? {};
  const {relatedProductsAccount} = global ?? {};

  if (sites?.isMavalaCorporate) {
    throw new Response('Not found', {status: 404});
  }

  return (
    <>
      <AccountMain />
      <RelatedProducts
        products={relatedProductsAccount?.references?.nodes ?? []}
      />
    </>
  );
}
