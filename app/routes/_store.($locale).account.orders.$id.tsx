import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import { type MetaFunction } from 'react-router';
import {getSeoMeta} from '@shopify/hydrogen';
import {RootLoader} from '~/root';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {OrderDetails} from '~/components/account/OrderDetails';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  data,
  matches: [root],
}) => {
  return [
    ...(getSeoMeta(root.data.seo, {
      title: `${root.data.translations.data.find(({id}) => id === 'order')?.message} ${data?.order?.name}`,
    }) ?? []),
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {locale, id} = params;
  const {customerAccount} = context;

  if (!params.id) {
    return redirect(locale ? `/${locale}/account/orders` : '/account/orders');
  }

  const orderId = atob(id!);
  const {data, errors} = await customerAccount.query(CUSTOMER_ORDER_QUERY, {
    variables: {orderId},
  });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  return {
    order: data?.order,
  };
}

export default function OrderRoute() {
  return <OrderDetails />;
}
