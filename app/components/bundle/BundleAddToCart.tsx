import {CartForm} from '@shopify/hydrogen';
import {FormattedMessage} from 'react-intl';
import {useBundleContext} from './BundleContext';
import {useCartDrawer} from '../cart/CartDrawer';
import {Button, ButtonEffect} from '../ui/Button';
import {ProductPrice} from '../product/ProductPrice';
import type {ProductItemFragment} from 'storefrontapi.generated';

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

  const lines = bundleVariant
    ? [
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
      ]
    : [];

  const handleClick = () => {
    setIsCartDrawerOpen(true);
  };

  return (
    <CartForm
      route="/resource/cart"
      inputs={{lines}}
      action={CartForm.ACTIONS.LinesAdd}
    >
      <Button
        type="submit"
        onClick={handleClick}
        aria-disabled={!allSelected || !bundleVariant}
        disabled={!allSelected || !bundleVariant}
      >
        {allSelected ? (
          <ButtonEffect>
            <FormattedMessage id="add" />
            <ProductPrice
              price={bundleVariant?.price}
              compareAtPrice={bundleVariant?.compareAtPrice}
            />
          </ButtonEffect>
        ) : (
          <FormattedMessage id="select_shades" defaultMessage="Select all shades" />
        )}
      </Button>
    </CartForm>
  );
}
