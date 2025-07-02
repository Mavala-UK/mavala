import {ANIMATION_DRAWER_DURATION} from '../ui/Drawer';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {CartForm} from '@shopify/hydrogen';
import {FormattedMessage} from 'react-intl';
import {useCartDrawer} from './CartDrawer';
import {Button, ButtonEffect} from '../ui/Button';
import {useProductViewDrawer} from '../product/drawer/ProductViewDrawer';
import {useDiscounts} from './DiscountsView';
import {ProductPrice} from '../product/ProductPrice';
import styles from './AddToCartButton.module.css';

export function AddToCartButton({
  analytics,
  selectedVariant,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button> & {
  analytics?: unknown;
  selectedVariant: ProductVariantFragment;
  className?: string;
}) {
  const {isCartDrawerOpen, setIsCartDrawerOpen} = useCartDrawer();
  const {isProductViewDrawerOpen, setIsProductViewDrawerOpen} =
    useProductViewDrawer();
  const {isGiftDrawerOpen, setIsGiftDrawerOpen} = useDiscounts();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    switch (true) {
      case isProductViewDrawerOpen:
        setIsProductViewDrawerOpen(false);
        isGiftDrawerOpen && setIsGiftDrawerOpen(false);
        setTimeout(() => {
          setIsCartDrawerOpen(true);
        }, ANIMATION_DRAWER_DURATION / 2);
        break;
      case isGiftDrawerOpen:
        isGiftDrawerOpen && setIsGiftDrawerOpen(false);
        setIsCartDrawerOpen(true);
        break;
      case isCartDrawerOpen:
      default:
        setIsCartDrawerOpen(true);
    }
  };

  const {availableForSale, price, compareAtPrice} = selectedVariant ?? {};

  const lines = selectedVariant
    ? [
        {
          merchandiseId: selectedVariant.id,
          selectedVariant,
        },
      ]
    : [];

  return (
    <div className={className}>
      <CartForm
        route="/resource/cart"
        inputs={{lines}}
        action={CartForm.ACTIONS.LinesAdd}
      >
        <input
          name="analytics"
          type="hidden"
          value={JSON.stringify(analytics)}
        />
        <Button
          type="submit"
          onClick={handleClick}
          className={styles.button}
          aria-disabled={!selectedVariant?.availableForSale}
          {...props}
        >
          {children ? (
            children
          ) : availableForSale ? (
            <ButtonEffect>
              <FormattedMessage id="add" />
              <ProductPrice price={price} compareAtPrice={compareAtPrice} />
            </ButtonEffect>
          ) : (
            <FormattedMessage id="out_of_stock" />
          )}
        </Button>
      </CartForm>
    </div>
  );
}
