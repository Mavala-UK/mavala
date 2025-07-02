import {Slot} from '@radix-ui/react-slot';
import {forwardRef} from 'react';
import styles from './TextContainer.module.css';
import {cn} from '~/lib/utils';

export const TextContainer = forwardRef<
  React.ComponentRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & {
    asChild?: boolean;
    variant?: 'block';
  }
>(function TextContainer({className, asChild, ...props}, ref) {
  const Component = asChild ? Slot : 'div';

  return (
    <Component className={cn(styles.root, className)} {...props} ref={ref} />
  );
});
