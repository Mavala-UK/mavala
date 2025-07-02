import {startTransition} from 'react';
import type {Feature} from 'geojson';
import {Text} from '../ui/Text';
import {Link} from '../ui/Link';
import {DrawerTrigger} from '~/components/ui/Drawer';
import {FormattedMessage} from 'react-intl';
import styles from './StoreLocatorList.module.css';

export function StoreLocatorList({
  stores,
  selectedStore,
  onClick,
}: {
  stores?: Feature[];
  selectedStore?: Feature;
  onClick?: (store: Feature) => void;
}) {
  return (
    <ul className={styles.root}>
      {stores?.map((store) => {
        const {name, address1, address2, address3, city, country, zip} =
          store.properties ?? {};

        const handleClick = () => {
          startTransition(() => {
            onClick?.(store);
          });
        };

        return (
          <li
            key={store?.properties?.id}
            className={styles.item}
            aria-current={
              selectedStore?.properties?.id === store?.properties?.id
                ? 'true'
                : undefined
            }
          >
            <Text weight="medium" size="sm" asChild>
              <h2>
                <button type="button" onClick={handleClick}>
                  {name}
                </button>
              </h2>
            </Text>
            <Text weight="light" size="sm">
              {address1 && (
                <>
                  {address1} <br />
                </>
              )}
              {address2 && (
                <>
                  {address2} <br />
                </>
              )}
              {address3 && (
                <>
                  {address3} <br />
                </>
              )}
              {`${zip} ${city}, ${country}`}
            </Text>
            <Text size="sm" weight="light" asChild>
              <Link
                variant="underline"
                asChild
                size="sm"
                onClick={handleClick}
                className={styles.trigger}
              >
                <DrawerTrigger>
                  <FormattedMessage id="learn_more" />
                </DrawerTrigger>
              </Link>
            </Text>
          </li>
        );
      })}
    </ul>
  );
}
