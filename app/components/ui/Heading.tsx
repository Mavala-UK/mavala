import {Slot} from '@radix-ui/react-slot';
import {forwardRef} from 'react';
import styles from './Heading.module.css';
import {cn} from '~/lib/utils';

export const Heading = forwardRef<
  React.ComponentRef<'h2'>,
  React.ComponentPropsWithoutRef<'h2'> & {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    asChild?: boolean;
  }
>(function Heading({className, size = 'md', asChild, ...props}, ref) {
  const Component = asChild ? Slot : 'h2';

  return (
    <Component
      className={cn(styles.root, className)}
      data-size={size}
      ref={ref}
      {...props}
    />
  );
});
