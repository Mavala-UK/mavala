import {Slot} from '@radix-ui/react-slot';
import {forwardRef} from 'react';
import styles from './Text.module.css';
import {cn} from '~/lib/utils';

export const Text = forwardRef<
  React.ComponentRef<'p'>,
  React.ComponentPropsWithoutRef<'p'> & {
    size?: '5xs' | '4xs' | '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'light' | 'medium' | 'accent';
    weight?: 'medium' | 'regular' | 'light';
    uppercase?: boolean;
    asChild?: boolean;
  }
>(function Text(
  {
    className,
    size = 'md',
    color,
    weight = 'regular',
    asChild,
    uppercase,
    ...props
  },
  ref,
) {
  const Component = asChild ? Slot : 'p';

  return (
    <Component
      className={cn(styles.root, className)}
      data-size={size}
      data-color={color}
      data-weight={weight}
      data-uppercase={uppercase}
      ref={ref}
      {...props}
    />
  );
});
