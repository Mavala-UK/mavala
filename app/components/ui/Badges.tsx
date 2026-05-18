import type {
  ProductItemFragment,
  ProductFragment,
} from 'storefrontapi.generated';
import {cn} from '~/lib/utils';
import {Text} from './Text';
import styles from './Badges.module.css';

export function Badges({
  items,
  className,
  size = 'md',
  variant,
}: {
  items: ProductItemFragment['badges'] | ProductFragment['badges'];
  size?: 'md' | 'lg';
  variant?: 'outline';
  className?: string;
}) {
  const badges = items?.references?.nodes;

  return (
    <div
      className={cn(styles.root, className)}
      data-size={size}
      data-variant={variant}
    >
      {badges?.map((badge) => (
        <Text
          uppercase
          className={styles.badge}
          key={badge.id}
          asChild
          size={size === 'lg' ? '4xs' : '5xs'}
          weight={size === 'lg' ? 'medium' : 'regular'}
        >
          <span>{badge.text?.value}</span>
        </Text>
      ))}
    </div>
  );
}
