import {FormattedMessage, FormattedNumber} from 'react-intl';
import {useDiscounts} from './DiscountsView';
import {useCartDrawer} from './CartDrawer';
import {Text} from '../ui/Text';
import styles from './CartProgress.module.css';

export function CartProgress() {
  const {freeShippingLimit} = useDiscounts();
  const {subtotalCart} = useCartDrawer();
  const {
    amount: freeShippingLimitAmount,
    currencyCode: freeShippingLimitCurrency,
  } = freeShippingLimit ?? {};
  const {amount: subtotalCartAmount, currencyCode: subtotalCartCurrency} =
    subtotalCart ?? {};
  const subtotalAmount = Number(subtotalCartAmount ?? 0);
  const freeShippingAmount = Number(freeShippingLimitAmount ?? 0);
  const amountLeft = freeShippingAmount - subtotalAmount;
  const amountPercent = Math.round(
    (subtotalAmount / Number(freeShippingLimitAmount)) * 100,
  );

  return (
    <div className={styles.root}>
      {amountLeft > 0 ? (
        <div className={styles.gauge}>
          <Text size="xs">
            <FormattedMessage id="label_free_delivery" />
          </Text>
          {subtotalAmount !== 0 && (
            <Text
              className={styles.amount}
              size="xs"
              weight="medium"
              color="accent"
            >
              <FormattedMessage
                id="amount_left"
                values={{
                  amount: (
                    <FormattedNumber
                      key={amountLeft}
                      value={amountLeft}
                      style="currency"
                      currency={
                        subtotalCartCurrency ?? freeShippingLimitCurrency
                      }
                    />
                  ),
                }}
              />
            </Text>
          )}
          <progress className={styles.progress} value={amountPercent} max={100}>
            <FormattedNumber value={amountPercent / 100} style="percent" />
          </progress>
        </div>
      ) : (
        <Text size="xs" weight="medium">
          <FormattedMessage id="free_delivery" />
        </Text>
      )}
    </div>
  );
}
