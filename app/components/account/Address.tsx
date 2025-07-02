import {Fragment} from 'react';
import {CustomerAddress} from '@shopify/hydrogen/customer-account-api-types';
import {Text} from '../ui/Text';
import styles from './Address.module.css';

export function Address({
  address,
  variant,
  title,
  fallbackMsg,
  children,
}: {
  address: CustomerAddress;
  variant: 'form' | 'order';
  title?: string;
  fallbackMsg?: string;
  children?: React.ReactNode;
}) {
  const {formatted, name} = address ?? {};

  return (
    <div className={styles.root} data-variant={variant}>
      {title && (
        <Text asChild weight="medium" size="sm" className={styles.title}>
          <h3>{title}</h3>
        </Text>
      )}
      <Text
        className={styles.address}
        {...(variant !== 'form' && {color: 'medium'})}
        weight="light"
      >
        {address ? (
          <>
            {name} <br />
            {formatted.map((line: string) => (
              <Fragment key={line}>
                {line}
                <br />
              </Fragment>
            ))}
          </>
        ) : (
          (fallbackMsg ?? '')
        )}
      </Text>
      {variant === 'form' && children}
    </div>
  );
}
