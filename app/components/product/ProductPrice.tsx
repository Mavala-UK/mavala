import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {cn, formatMoney} from '~/lib/utils';
import styles from './ProductPrice.module.css';

export function ProductPrice({
  price,
  compareAtPrice,
  className,
}: {
  price: {amount?: string | null; currencyCode?: string | null} | null | undefined;
  compareAtPrice?: {amount?: string | null; currencyCode?: string | null} | null | undefined;
  className?: string;
}) {
  if (!price) {
    return null;
  }

  return (
    <span className={cn(styles.root, className, 'product-price')}>
      {compareAtPrice &&
        Number(price.amount) !== Number(compareAtPrice.amount) && (
          <em className={styles['original-price']}>
            <s>{formatMoney(compareAtPrice)}</s>
          </em>
        )}
      <i className={styles.price}>{formatMoney(price)}</i>
    </span>
  );
}
