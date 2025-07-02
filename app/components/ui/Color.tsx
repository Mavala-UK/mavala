import {cn} from '~/lib/utils';
import {Text} from '../ui/Text';
import type {MainColorFragment} from 'storefrontapi.generated';
import styles from './Color.module.css';

export function Color({
  productColor,
  className,
}: {
  productColor: MainColorFragment;
  className?: string;
}) {
  const {name, code} = productColor?.mainColor?.reference ?? {};

  return (
    <span className={cn(styles.root, className)}>
      <span
        className={styles.color}
        style={{
          backgroundColor: String(code?.value),
        }}
        data-border={name?.value === 'Transparent' || code?.value === '#ffffff'}
      />
      <Text asChild size="sm">
        <span>{name?.value}</span>
      </Text>
    </span>
  );
}
