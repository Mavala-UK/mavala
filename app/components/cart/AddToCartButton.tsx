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

declare global {
  interface Window {
    dataLayer: {[key: string]: unknown; event: string}[];
    TriplePixel?: (
      event: string,
      data: {item: string; q: number; v: string},
    ) => void;
  }
}

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

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    // Trigger GTM tracking
    if (window.dataLayer) {
      const productId =
        (selectedVariant as any).product?.id || selectedVariant.id;
      const vendor = (selectedVariant as any).product?.vendor || '';

      const gtmData: any = {
        event: 'add_to_cart',
        ecommerce: {
          currency: selectedVariant.price.currencyCode,
          value: selectedVariant.price.amount,
          items: [
            {
              item_id: `shopify_ZZ_${productId.split('/').pop()}_${selectedVariant.id.split('/').pop()}`,
              item_name: selectedVariant.product.title,
              item_price: Number(selectedVariant.price.amount),
              item_brand: vendor,
              item_category: selectedVariant.product.productType,
              item_variant:
                selectedVariant.title === 'Default Title'
                  ? selectedVariant.product.title
                  : selectedVariant.title,
              quantity: 1,
            },
          ],
        },
      };
      window.dataLayer.push(gtmData);
    }

    // Trigger Triple Whale tracking
    if (window.TriplePixel) {
      const productId =
        (selectedVariant as any).product?.id || selectedVariant.id;

      const tripleWhalePayload = {
        item: productId,
        q: 1,
        v: selectedVariant.id,
      };
      window.TriplePixel('AddToCart', tripleWhalePayload);
    }

    // Handle drawer opening
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
