import {useState} from 'react';
import {cn} from '~/lib/utils';
import {useIntl} from 'react-intl';
import {Minus} from '../icons/Minus';
import {Plus} from '../icons/Plus';
import {Text} from './Text';
import styles from './QuantityButton.module.css';

export function QuantityButton({
  value = 1,
  onValueChange,
  className,
  ref,
  ...props
}: React.ComponentProps<'div'> & {
  value?: number;
  onValueChange?: (value: number) => void;
}) {
  const {formatMessage} = useIntl();
  const [quantity, setQuantity] = useState(value);

  const handleQuantityChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const isDisabled =
      event.currentTarget.getAttribute('aria-disabled') === 'true';

    if (isDisabled) return;

    const value = parseInt(event.target.value);

    setQuantity(value);
    onValueChange?.(value);
  };

  const handleDecrement: React.MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    const isDisabled =
      event.currentTarget.getAttribute('aria-disabled') === 'true';

    if (isDisabled || quantity === 1) return;

    setQuantity((quantity) => quantity - 1);
    onValueChange?.(quantity - 1);
  };

  const handleIncrement: React.MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    const isDisabled =
      event.currentTarget.getAttribute('aria-disabled') === 'true';

    if (isDisabled || quantity >= 99) return;

    setQuantity((quantity) => quantity + 1);
    onValueChange?.(quantity + 1);
  };

  if (quantity !== value) {
    setQuantity(value);
  }

  return (
    <div className={cn(styles.root, className)} ref={ref} {...props}>
      <button
        className={styles.button}
        type="button"
        onClick={handleDecrement}
        title={formatMessage({
          id: 'reduce_quantity',
        })}
        aria-disabled={quantity <= 1 ? 'true' : props['aria-disabled']}
      >
        <Minus />
      </button>
      <Text size="xs" weight="light" asChild>
        <input
          className={styles.control}
          type="number"
          value={quantity}
          min={1}
          max={99}
          inputMode="numeric"
          aria-label={formatMessage({
            id: 'quantity',
          })}
          aria-disabled={props['aria-disabled']}
          onChange={handleQuantityChange}
        />
      </Text>
      <button
        className={styles.button}
        type="button"
        title={formatMessage({
          id: 'increase_quantity',
        })}
        aria-disabled={props['aria-disabled']}
        onClick={handleIncrement}
      >
        <Plus />
      </button>
    </div>
  );
}
