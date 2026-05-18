import {CartForm} from '@shopify/hydrogen';
import {FormattedMessage} from 'react-intl';
import {useBundleContext} from './BundleContext';
import {useCartDrawer} from '../cart/CartDrawer';
import {Button, ButtonEffect} from '../ui/Button';
import {ProductPrice} from '../product/ProductPrice';
import {Text} from '../ui/Text';
import type {ProductItemFragment} from 'storefrontapi.generated';
import styles from './BundleAddToCart.module.css';

export function BundleAddToCart({
  components,
}: {
  components: ProductItemFragment[];
}) {
  const {bundleProduct, selectedVariants} = useBundleContext();
  const {setIsCartDrawerOpen} = useCartDrawer();

  const bundleVariant = bundleProduct.selectedVariant ?? bundleProduct.variants.nodes[0];

  const allSelected = components.every(
    (c) => !!selectedVariants[c.handle],
  );

  if (!allSelected || !bundleVariant) {
    return (
      <Text size="sm" className={styles.helper}>
        <FormattedMessage
          id="bundle_pick_shade_helper"
          defaultMessage="Pick a shade for each item to add to cart."
        />
      </Text>
    );
  }

  const lines = [
    {
      merchandiseId: bundleVariant.id,
      quantity: 1,
      attributes: components.flatMap((component, i) => [
        {
          key: `_component_${i + 1}`,
          value: selectedVariants[component.handle]?.id ?? '',
        },
        {
          key: component.title,
          value: selectedVariants[component.handle]?.title ?? '',
        },
      ]),
    },
  ];

  const handleClick = () => {
    setIsCartDrawerOpen(true);
  };

  return (
    <CartForm
      route="/resource/cart"
      inputs={{lines}}
      action={CartForm.ACTIONS.LinesAdd}
    >
      <Button type="submit" onClick={handleClick}>
        <ButtonEffect>
          <FormattedMessage id="add" />
          <ProductPrice
            price={bundleVariant.price}
            compareAtPrice={bundleVariant.compareAtPrice}
          />
        </ButtonEffect>
      </Button>
    </CartForm>
  );
}
