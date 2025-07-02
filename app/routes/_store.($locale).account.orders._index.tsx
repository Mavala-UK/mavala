import { type MetaFunction } from 'react-router';
import {getSeoMeta} from '@shopify/hydrogen';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {RootLoader} from '~/root';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {ACCOUNT_ROUTES} from '~/components/account/AccountMain';
import {OrdersTable} from '~/components/account/OrdersTable';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  matches: [root],
}) => {
  return [
    ...(getSeoMeta(root.data.seo, {
      title: root.data.translations.data.find(
        ({id}) => id === ACCOUNT_ROUTES.orders,
      )?.message,
    }) ?? []),
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {customerAccount} = context;

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY);

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {
    customer: data.customer,
  };
}

export default function Orders() {
  return <OrdersTable />;
}
