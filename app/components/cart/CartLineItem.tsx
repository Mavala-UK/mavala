import { useSubmit } from 'react-router';
import {CartForm, type OptimisticCartLine} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useCartDrawer} from './CartDrawer';
import {useIntl} from 'react-intl';
import {useVariantUrl} from '~/hooks/useVariantUrl';
import {Remove} from '../icons/Remove';
import {slugify} from '~/lib/utils';
import {Image} from '../ui/Image';
import {Text} from '../ui/Text';
import {Heading} from '../ui/Heading';
import {Link} from '../common/Link';
import {ProductPrice} from '../product/ProductPrice';
import {QuantityButton} from '../ui/QuantityButton';
import styles from './CartLineItem.module.css';

export function CartLineItem({
  line,
}: {
  line: OptimisticCartLine<CartApiQueryFragment>;
}) {
  const {formatMessage} = useIntl();
  const {setIsCartDrawerOpen} = useCartDrawer();
  const submit = useSubmit();
  const {id, merchandise, cost, quantity, isOptimistic, discountAllocations, attributes} =
    line ?? {};
  const {subtotalAmount, totalAmount} = cost ?? {};
  const {image, product, selectedOptions, quantityAvailable, price} =
    merchandise ?? {};
  const {handle, title, productType} = product ?? {};
  const isBundle = productType === 'Bundle';
  const bundleAttributes = (attributes ?? []).filter(
    ({key}) => !key.startsWith('_'),
  );
  const lineItemUrl = useVariantUrl(handle, selectedOptions);
  const isFree = price?.amount === '0.0';
  const hasDiscount =
    discountAllocations?.length! > 0 &&
    discountAllocations?.some(
      ({discountedAmount}) => discountedAmount?.amount !== '0.0',
    );

  const handleValueChange = (value: number) => {
    submit(
      {
        cartFormInput: JSON.stringify({
          action: CartForm.ACTIONS.LinesUpdate,
          inputs: {lines: [{id, quantity: value}]},
        }),
        [value > quantity ? 'increase-quantity' : 'decrease-quantity']:
          quantity,
      },
      {
        action: '/resource/cart',
        method: 'POST',
        navigate: false,
      },
    );
  };

  const handleRemove: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const isDisabled =
      event.currentTarget.getAttribute('aria-disabled') === 'true';

    if (isDisabled) {
      event.preventDefault();
    }
  };

  return (
    <li className={styles.root} aria-busy={isOptimistic}>
      {image && (
        <div className={styles.image}>
          <Image data={image} aspectRatio="1/1" sizes="5rem" />
        </div>
      )}
      <div className={styles.content}>
        {productType && (
          <Text size="5xs" uppercase color="medium" className={styles.type}>
            {productType}
          </Text>
        )}
        <Heading asChild size="sm">
          {isFree ? (
            <p>{title}</p>
          ) : (
            <Link
              to={lineItemUrl}
              className={styles.title}
              onClick={() => setIsCartDrawerOpen(false)}
              aria-disabled={isOptimistic}
            >
              {title}
            </Link>
          )}
        </Heading>
        {selectedOptions[0].value !== 'Default Title' && (
          <Text weight="light" size="xs" color="medium">
            {selectedOptions[0].value}
          </Text>
        )}
        {isBundle && bundleAttributes.length > 0 && (
          <div className={styles.bundleComponents}>
            {bundleAttributes.map(({key, value}) => (
              <Text key={key} size="2xs" color="medium" weight="light">
                {key}: {value}
              </Text>
            ))}
          </div>
        )}
        {discountAllocations?.map(({title}) => (
          <Text
            key={slugify(title)}
            size="2xs"
            color="medium"
            weight="light"
            className={styles.discount}
          >
            {title}
          </Text>
        ))}
      </div>
      <Text weight="medium" size="sm">
        <ProductPrice
          price={totalAmount}
          compareAtPrice={subtotalAmount}
          className={styles.price}
        />
      </Text>
      {quantityAvailable! > 1 && !hasDiscount && (
        <QuantityButton
          className={styles.quantity}
          value={quantity}
          onValueChange={handleValueChange}
          aria-disabled={isOptimistic || isFree}
        />
      )}
      <CartForm
        route="/resource/cart"
        action={CartForm.ACTIONS.LinesRemove}
        inputs={{lineIds: [id]}}
      >
        <button
          type="submit"
          className={styles.remove}
          aria-disabled={isOptimistic}
          onClick={handleRemove}
          title={formatMessage({id: 'delete'})}
        >
          <Remove />
        </button>
      </CartForm>
    </li>
  );
}
