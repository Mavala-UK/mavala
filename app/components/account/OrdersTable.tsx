import { useLoaderData } from 'react-router';
import type {loader} from '~/routes/_store.($locale).account.orders._index';
import {
  FormattedMessage,
  FormattedDate,
  FormattedList,
  useIntl,
} from 'react-intl';
import {OrderItemFragment} from 'customer-accountapi.generated';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {ProductPrice} from '../product/ProductPrice';
import {flattenConnection} from '@shopify/hydrogen';
import {
  OrderFinancialStatus,
  FulfillmentEventStatus,
} from '@shopify/hydrogen/customer-account-api-types';
import {Text} from '../ui/Text';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/Table';
import {Link} from '../ui/Link';
import styles from './OrdersTable.module.css';

const FINANCIAL_STATUSES: Record<OrderFinancialStatus, string> = {
  AUTHORIZED: 'authorized',
  EXPIRED: 'expired',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially_paid',
  PARTIALLY_REFUNDED: 'partially_refunded',
  PENDING: 'pending',
  REFUNDED: 'refunded',
  VOIDED: 'voided',
};

const SHIPMENT_STATUSES: Record<FulfillmentEventStatus, string> = {
  ATTEMPTED_DELIVERY: 'attempted_delivery',
  CARRIER_PICKED_UP: 'carrier_picked_up',
  CONFIRMED: 'confirmed',
  DELAYED: 'delayed',
  DELIVERED: 'delivered',
  FAILURE: 'failure',
  IN_TRANSIT: 'in_transit',
  LABEL_PRINTED: 'label_printed',
  LABEL_PURCHASED: 'label_purchased',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  PICKED_UP: 'picked_up',
  READY_FOR_PICKUP: 'ready_for_pickup',
};

export function OrdersTable() {
  const {customer} = useLoaderData<typeof loader>();
  const {orders} = customer;

  if (!orders?.nodes.length) {
    return (
      <Text weight="light">
        <FormattedMessage id="empty_orders" />
      </Text>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader scope="col">
            <FormattedMessage id="order_number" />
          </TableHeader>
          <TableHeader scope="col">
            <FormattedMessage id="date" />
          </TableHeader>
          <TableHeader scope="col">
            <FormattedMessage id="status" />
          </TableHeader>
          <TableHeader scope="col">
            <FormattedMessage id="tracking_number" />
          </TableHeader>
          <TableHeader scope="col">
            <FormattedMessage id="total_vat" />
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.nodes.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </TableBody>
    </Table>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const {formatMessage} = useIntl();
  const pathWithLocale = usePathWithLocale(`/account/orders`);
  const {name, processedAt, totalPrice} = order ?? {};
  const fulfillments = flattenConnection(order.fulfillments);

  const trackingInformation = fulfillments
    ?.find((fulfillment) => (fulfillment.trackingInformation ?? []).length > 0)
    ?.trackingInformation.find((tracking) => tracking.number);

  const financialStatus = FINANCIAL_STATUSES[order.financialStatus!];

  const latestShipmentStatus =
    SHIPMENT_STATUSES[fulfillments?.[0]?.latestShipmentStatus!];

  const status = [financialStatus, latestShipmentStatus]
    .filter(Boolean)
    .map((id) => formatMessage({id})) as string[];

  return (
    <TableRow key={order.id}>
      <TableCell>
        <Link
          to={`${pathWithLocale}/${btoa(order.id)}`}
          variant="animated-underline-reverse"
        >
          {name}
        </Link>
      </TableCell>
      <TableCell>
        <time dateTime={processedAt}>
          <FormattedDate
            value={new Date(processedAt)}
            day="2-digit"
            month="short"
            year="numeric"
          />
        </time>
      </TableCell>
      <TableCell>
        {status.length > 0 ? (
          <FormattedList type="conjunction" style="long" value={status} />
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        {trackingInformation ? (
          <Link
            to={trackingInformation.url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            variant="animated-underline-reverse"
          >
            {trackingInformation.number}
          </Link>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        <ProductPrice price={totalPrice} />
      </TableCell>
    </TableRow>
  );
}
