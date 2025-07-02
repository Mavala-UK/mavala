import {Slot} from '@radix-ui/react-slot';
import {forwardRef} from 'react';
import styles from './Button.module.css';
import {cn} from '~/lib/utils';

export const Button = forwardRef<
  React.ComponentRef<'button'>,
  React.ComponentPropsWithoutRef<'button'> & {
    theme?: 'dark' | 'light' | 'grayed' | 'ghost';
    variant?: 'flat' | 'unstyled';
    size?: '4xs' | '3xs' | '2xs' | 'xs' | 'sm' | 'md';
    color?: 'light';
    asChild?: boolean;
  }
>(function Button(
  {
    className,
    theme = 'dark',
    variant = 'flat',
    size = 'md',
    color,
    asChild,
    ...props
  },
  ref,
) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      className={cn(styles.root, className)}
      {...(variant === 'flat' && {
        'data-theme': theme,
      })}
      data-variant={variant}
      data-size={size}
      data-color={color}
      ref={ref}
      {...props}
    />
  );
});

/* Wrap for hover button animation */
export function ButtonEffect({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <span className={styles.clip} {...props}>
      <span className={styles.text}>{children}</span>
    </span>
  );
}
