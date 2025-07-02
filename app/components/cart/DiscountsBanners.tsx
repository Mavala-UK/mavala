import {Text} from '../ui/Text';
import {cn, slugify} from '~/lib/utils';
import pluralize from 'pluralize-esm';
import {useCartDrawer} from './CartDrawer';
import {useIntl, FormattedMessage} from 'react-intl';
import {CartProgress} from './CartProgress';
import {useDiscounts, type DiscountWithTotalsType} from './DiscountsView';
import styles from './DiscountsBanners.module.css';

export function DiscountsBanners({isBusy}: {isBusy: boolean}) {
  const {freeShippingLimit, availableBxgyDiscounts, availableGifts} =
    useDiscounts();

  return (
    <div className={styles.root} aria-live="polite" aria-busy={isBusy}>
      {freeShippingLimit && (
        <div className={cn(styles.banner, styles.progress)}>
          {!isBusy && <CartProgress />}
        </div>
      )}
      {availableBxgyDiscounts?.map((discount) => (
        <RemainingBanner key={slugify(discount.title)} discount={discount} />
      ))}
      {availableGifts?.length! > 0 && (
        <Text
          size="xs"
          className={cn(styles.banner, styles['gift-message-banner'])}
        >
          <FormattedMessage id="add_product_gift_to_cart" />
        </Text>
      )}
    </div>
  );
}

function RemainingBanner({discount}: {discount: DiscountWithTotalsType}) {
  const {formatMessage, formatNumber} = useIntl();
  const {subtotalCart} = useCartDrawer();
  const {title, customerBuys, totalAmount, totalQuantity, hasGiftAvailable} =
    discount ?? {};
  const {value} = customerBuys ?? {};

  let text: string | null = null;
  let remaining: number | null = null;

  switch (value.__typename) {
    case 'DiscountQuantity': {
      remaining = Number(value.quantity) - Number(totalQuantity);
      text = pluralize(formatMessage({id: 'articles'}), remaining, true);
      break;
    }
    case 'DiscountPurchaseAmount': {
      remaining = Number(value.amount) - Number(totalAmount);
      text = formatNumber(remaining, {
        style: 'currency',
        currency: subtotalCart?.currencyCode,
        minimumFractionDigits: remaining % 1 === 0 ? 0 : 2,
      });
      break;
    }
  }

  if (hasGiftAvailable || !text || !remaining) {
    return null;
  }

  return (
    <Text size="xs" className={cn(styles.banner, styles['remaining-banner'])}>
      {formatMessage({id: 'remaining_text'}, {value: text})} {title}
    </Text>
  );
}
