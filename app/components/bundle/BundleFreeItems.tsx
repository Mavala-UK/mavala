import {Sparkles} from '../icons/accordion/Sparkles';
import {Image} from '../ui/Image';
import {Text} from '../ui/Text';
import {cn} from '~/lib/utils';
import styles from './BundleFreeItems.module.css';

type FreeItem = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  } | null;
};

export function BundleFreeItems({items}: {items: FreeItem[]}) {
  if (!items?.length) return null;

  return (
    <div className={styles.root}>
      <span className={styles.badge}>
        <Sparkles />
        <Text size="xs" weight="medium" className={styles.badgeText}>
          Includes free
        </Text>
      </span>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            {item.featuredImage && (
              <Image
                data={item.featuredImage}
                aspectRatio="1/1"
                sizes="4rem"
                className={styles.thumbnail}
              />
            )}
            <div className={styles.itemInfo}>
              <Text size="xs">{item.title}</Text>
              {item.priceRange?.minVariantPrice && (
                <Text size="2xs" color="medium">
                  {formatPrice(item.priceRange.minVariantPrice)}
                </Text>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatPrice(price: {amount: string; currencyCode: string}) {
  const amount = parseFloat(price.amount);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: price.currencyCode || 'GBP',
  }).format(amount);
}
