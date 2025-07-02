import {forwardRef} from 'react';
import {Close} from '../icons/Close';
import styles from './CloseButton.module.css';
import {useIntl} from 'react-intl';
import {cn} from '~/lib/utils';

export const CloseButton = forwardRef<
  React.ComponentRef<'button'>,
  React.ComponentPropsWithoutRef<'button'>
>(function CloseButton({className, ...props}, ref) {
  const {formatMessage} = useIntl();

  return (
    <button
      className={cn(styles.root, className)}
      title={formatMessage({id: 'close'})}
      ref={ref}
      {...props}
    >
      <Close />
    </button>
  );
});
