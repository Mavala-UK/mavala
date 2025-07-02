import {Slot} from '@radix-ui/react-slot';
import type { LinkProps } from 'react-router';
import {forwardRef} from 'react';
import {Link as RemixLink} from '../common/Link';
import styles from './Link.module.css';
import {cn} from '~/lib/utils';

export const Link = forwardRef<
  React.ComponentRef<typeof RemixLink>,
  Partial<React.ComponentPropsWithoutRef<typeof RemixLink>> & {
    asChild?: boolean;
    variant?: 'underline' | 'animated-underline' | 'animated-underline-reverse';
    size?: 'sm' | 'md';
    color?: 'grayed';
  }
>(function Link(
  {to, className, variant, size = 'md', color, asChild, ...props},
  ref,
) {
  const Component = asChild ? Slot : RemixLink;

  return (
    <Component
      to={to as LinkProps['to']}
      className={cn(styles.root, className)}
      data-variant={variant}
      data-size={size}
      data-color={color}
      ref={ref}
      {...props}
    />
  );
});
