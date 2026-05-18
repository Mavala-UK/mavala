import {Suspense, use} from 'react';
import { useRouteLoaderData } from 'react-router';
import type {RootLoader} from '~/root';
import pluralize from 'pluralize-esm';
import {useIntl} from 'react-intl';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {DrawerTrigger as DrawerCartTrigger} from '../ui/Drawer';
import {Cart} from '../icons/Cart';
import {Text} from '../ui/Text';
import styles from './CartDrawerButton.module.css';

export function CartDrawerButton() {
  return (
    <Suspense fallback={<CartDrawerButtonFallback />}>
      <CartDrawerButtonContent />
    </Suspense>
  );
}

function CartDrawerButtonFallback() {
  const {formatMessage} = useIntl();
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  return (
    <DrawerCartTrigger
      className={styles.root}
      title={`${formatMessage({
        id: 'my_basket',
      })} (${pluralize('article', 0, true)})`}
    >
      <Cart />
      <Text asChild size={isDesktop ? '4xs' : '5xs'} weight="medium">
        <span className={styles.count} data-count={0} aria-hidden="true">
          {0}
        </span>
      </Text>
    </DrawerCartTrigger>
  );
}

function CartDrawerButtonContent() {
  const {formatMessage} = useIntl();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const data = useRouteLoaderData<RootLoader>('root');
  const cart = use(data?.cart!);
  const count = cart?.totalQuantity || 0;

  return (
    <DrawerCartTrigger
      className={styles.root}
      title={`${formatMessage({
        id: 'my_basket',
      })} (${pluralize('article', count, true)})`}
    >
      <Cart />
      <Text asChild size={isDesktop ? '4xs' : '5xs'} weight="medium">
        <span className={styles.count} data-count={count} aria-hidden="true">
          {count}
        </span>
      </Text>
    </DrawerCartTrigger>
  );
}
