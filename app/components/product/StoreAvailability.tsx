import {FormattedMessage} from 'react-intl';
import {useProductView} from './ProductView';
import {Text} from '../ui/Text';
import styles from './StoreAvailability.module.css';

export function StoreAvailability() {
  const {selectedVariant} = useProductView();
  const available = !!selectedVariant?.availableForSale;

  return (
    <div className={styles.root}>
      <Text asChild weight="medium" size="sm" className={styles.title}>
        <h2>
          <FormattedMessage id="delivery" />
        </h2>
      </Text>
      <Text size="sm" weight="light" className={styles.text}>
        <FormattedMessage id="home_or_relay" />
      </Text>
      <Text
        size="xs"
        weight="light"
        data-available={available}
        className={styles.availability}
      >
        {available ? (
          <FormattedMessage id="in_stock_delivery" />
        ) : (
          <FormattedMessage id="out_of_stock_delivery" />
        )}
      </Text>
    </div>
  );
}
