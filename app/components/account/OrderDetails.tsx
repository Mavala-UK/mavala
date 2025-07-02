import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import type {loader} from '~/routes/_store.($locale).account.orders.$id';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import { useLoaderData } from 'react-router';
import {flattenConnection} from '@shopify/hydrogen';
import {formatMoney} from '~/lib/utils';
import {OrderLineItemFullFragment} from 'customer-accountapi.generated';
import {
  FormattedMessage,
  FormattedNumber,
  useIntl,
  FormattedDate,
} from 'react-intl';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {Text} from '../ui/Text';
import {Link} from '../ui/Link';
import {Heading} from '../ui/Heading';
import {useDiscounts} from '../cart/DiscountsView';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableFoot,
} from '../ui/Table';
import {ProductPrice} from '../product/ProductPrice';
import {Address} from './Address';
import styles from './OrderDetails.module.css';

export function OrderDetails() {
  const {freeShippingLimit} = useDiscounts();
  const pathWithLocale = usePathWithLocale(`/account/orders`);
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {formatMessage} = useIntl();
  const {order} = useLoaderData<typeof loader>();

  const {
    name,
    processedAt,
    subtotal,
    totalTax,
    totalShipping,
    totalPrice,
    billingAddress,
    shippingAddress,
    shippingDiscountAllocations,
  } = order ?? {};

  const lineItems = flattenConnection(order.lineItems);
  const discountApplications = flattenConnection(order.discountApplications);
  const discount = discountApplications.filter(
    (d) => d.targetType !== 'SHIPPING_LINE',
  )?.[0]?.value;

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <Text size="sm" weight="light" asChild>
          <Link to={pathWithLocale} variant="underline">
            <FormattedMessage id="back_to_orders" />
          </Link>
        </Text>
        <Heading size={isDesktop ? 'xl' : 'lg'}>
          {formatMessage({id: 'order'})} {name}
        </Heading>
        <Text color="medium" weight="light">
          <FormattedMessage
            id="order_placed_on"
            values={{
              date: (
                <time dateTime={processedAt} key={processedAt}>
                  <FormattedDate
                    value={new Date(processedAt)}
                    dateStyle="long"
                    timeStyle="short"
                  />
                </time>
              ),
            }}
          />
        </Text>
      </header>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableHeader scope="col">
              <FormattedMessage id="product" />
            </TableHeader>
            <TableHeader scope="col">
              <FormattedMessage id="price" />
            </TableHeader>
            <TableHeader scope="col">
              <FormattedMessage id="quantity" />
            </TableHeader>
            <TableHeader scope="col">
              <FormattedMessage id="total" />
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {lineItems?.map((line) => <OrderLine key={line.id} line={line} />)}
        </TableBody>
        <TableFoot className={styles['table-footer']}>
          {discount && (
            <OrderLineDetails title="discount">
              {(() => {
                switch (discount.__typename) {
                  case 'PricingPercentageValue':
                    return (
                      <FormattedNumber
                        style="percent"
                        maximumFractionDigits={2}
                        value={-(discount.percentage / 100)}
                      />
                    );
                  case 'MoneyV2':
                    return formatMoney({
                      amount: (Number(discount.amount) * -1).toString(),
                      currencyCode: discount.currencyCode,
                    });
                }
              })()}
            </OrderLineDetails>
          )}
          <OrderLineDetails title="subtotal">
            {formatMoney(subtotal)}
          </OrderLineDetails>
          {totalTax?.amount !== '0.0' && (
            <OrderLineDetails title="taxes">
              {formatMoney(totalTax)}
            </OrderLineDetails>
          )}
          <OrderLineDetails title="delivery_costs">
            {shippingDiscountAllocations.length > 0 &&
            Number(totalPrice.amount) >= Number(freeShippingLimit?.amount) ? (
              <ProductPrice
                price={'0.0' as unknown as MoneyV2}
                compareAtPrice={totalShipping}
              />
            ) : (
              formatMoney(totalShipping)
            )}
          </OrderLineDetails>
          <OrderLineDetails title="total">
            {formatMoney(totalPrice)}
          </OrderLineDetails>
        </TableFoot>
      </Table>
      <Address
        variant="order"
        address={billingAddress!}
        title={formatMessage({
          id: 'billing_address',
        })}
        fallbackMsg={formatMessage({
          id: 'no_billing_address',
        })}
      />
      <Address
        variant="order"
        address={shippingAddress!}
        title={formatMessage({
          id: 'shipping_address',
        })}
        fallbackMsg={formatMessage({
          id: 'no_shipping_address',
        })}
      />
    </section>
  );
}

/*  */
/*  */
/* Order line */
function OrderLine({line}: {line: OrderLineItemFullFragment}) {
  const {title, variantTitle, quantity, price, totalPrice, totalDiscount} =
    line ?? {};
  const {amount: totalPriceAmount, currencyCode} = totalPrice ?? {};
  const {amount: totalDiscountAmount} = totalDiscount ?? {};

  return (
    <TableRow key={line?.id}>
      <TableCell>
        {title} {variantTitle && `(${variantTitle})`}
      </TableCell>
      <TableCell>
        <ProductPrice price={price} />
      </TableCell>
      <TableCell>{quantity}</TableCell>
      <TableCell>
        <ProductPrice
          price={
            totalPrice && {
              amount: (
                Number(totalPriceAmount) - Number(totalDiscountAmount)
              ).toString(),
              currencyCode: currencyCode!,
            }
          }
          compareAtPrice={totalPrice}
        />
      </TableCell>
    </TableRow>
  );
}

/*  */
/*  */
/* Order line Details footer */
function OrderLineDetails({
  title,
  children,
}: {
  title: string;
  children: string | React.ReactElement<typeof ProductPrice>;
}) {
  return (
    <TableRow>
      <TableCell colSpan={2}></TableCell>
      <TableHeader scope="row">
        <FormattedMessage id={title} />
      </TableHeader>
      <TableCell>{children}</TableCell>
    </TableRow>
  );
}
