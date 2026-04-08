import {createContext, useState, use, Suspense} from 'react';
import { useRouteLoaderData, useSearchParams, useFetchers } from 'react-router';
import {Analytics, useOptimisticCart} from '@shopify/hydrogen';
import type {OptimisticCartLine} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {RootLoader} from '~/root';
import {FormattedMessage} from 'react-intl';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {CartLineItem} from './CartLineItem';
import {Close} from '../icons/Close';
import {DialogClose} from '@radix-ui/react-dialog';
import type {OptimisticCart} from '@shopify/hydrogen';
import {
  DrawerContent,
  DrawerTitle,
  Drawer,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
  DrawerBody,
} from '../ui/Drawer';
import {DiscountsView} from './DiscountsView';
import {useProductRecommendations} from '~/hooks/useProductRecommendations';
import {Button, ButtonEffect} from '../ui/Button';
import {Text} from '../ui/Text';
import {ProductPrice} from '../product/ProductPrice';
import {CompleteYourOrder} from '../ui/CompleteYourOrder';
import {DiscountsBanners} from './DiscountsBanners';
import {Gifts} from './Gifts';
import styles from './CartDrawer.module.css';

export function CartDrawer() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {global} = data ?? {};
  const {optimisticCart} = useCartDrawer();
  const {checkoutUrl, cost} = optimisticCart ?? {};
  const lines = optimisticCart?.lines?.nodes ?? [];
  const fetchers = useFetchers();
  const isFetchingCart = fetchers.some(
    ({formData}) => !!formData?.get('cartFormInput'),
  );

  const areAllItemsAvailable = lines?.every(
    (line) => line?.merchandise?.product?.productType === 'Bundle' || (line?.merchandise?.quantityAvailable ?? 0) > 0,
  );

  const isEmpty =
    Object.keys(optimisticCart ?? {}).length === 0 || lines?.length === 0;

  const {data: relatedProducts} = useProductRecommendations([
    ...new Set(
      lines?.map((line) => line?.merchandise?.product?.handle).filter(Boolean),
    ),
  ]);

  const productRecommendations = isEmpty
    ? global?.relatedProductsEmptyCard?.references?.nodes!
    : relatedProducts?.filter(
        (product) =>
          !lines.some(
            (line) => line?.merchandise?.product?.handle === product.handle,
          ),
      );

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (isEmpty || !areAllItemsAvailable) {
      return;
    }

    event.preventDefault();

    location.href = checkoutUrl ?? '/';
  };

  return (
    <DrawerContent>
      <DrawerHeader className={styles.header}>
        <DrawerTitle asChild className={styles.title}>
          <Text size="sm" asChild>
            <h2>
              <FormattedMessage id="my_basket" />
            </h2>
          </Text>
        </DrawerTitle>
        <DrawerClose className={styles.close}>
          <Close />
        </DrawerClose>
        {!isEmpty && <DiscountsBanners isBusy={isFetchingCart} />}
      </DrawerHeader>
      <DrawerBody className={styles.body}>
        {isEmpty ? (
          <Text size="sm" color="medium" className={styles.empty}>
            <FormattedMessage id="empty_cart" />
          </Text>
        ) : (
          <>
            <Gifts isBusy={isFetchingCart} />
            <ul className={styles.lines}>
              {lines?.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line as OptimisticCartLine<CartApiQueryFragment>}
                />
              ))}
            </ul>
          </>
        )}
        <CompleteYourOrder
          products={productRecommendations}
          className={styles['product-recommendations']}
          variant="cart"
        />
      </DrawerBody>
      <DrawerFooter className={styles.footer}>
        {isEmpty ? (
          <DialogClose asChild>
            <Button>
              <ButtonEffect>
                <FormattedMessage id="continue_shopping" />
              </ButtonEffect>
            </Button>
          </DialogClose>
        ) : (
          <Button
            aria-busy={isFetchingCart}
            onClick={() => {
              console.log('checkout click', {
                checkoutUrl,
                areAllItemsAvailable,
                lines: lines?.map((l) => ({
                  title: l?.merchandise?.product?.title,
                  quantityAvailable: l?.merchandise?.quantityAvailable,
                  id: l?.merchandise?.id,
                })),
              });
              if (!areAllItemsAvailable) return;
              location.href = checkoutUrl ?? '/checkout';
            }}
          >
            <ButtonEffect>
              <FormattedMessage id="finalize_order" />
              <ProductPrice
                price={cost?.totalAmount as MoneyV2}
                compareAtPrice={cost?.subtotalAmount as MoneyV2}
              />
            </ButtonEffect>
          </Button>
        )}
        <Text size="xs">
          <FormattedMessage id="calculation_delivery" />
        </Text>
      </DrawerFooter>
      <Analytics.CartView />
    </DrawerContent>
  );
}

export function useCartDrawer() {
  return use(CartDrawerContext);
}

const CartDrawerContext = createContext<{
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  optimisticCart: OptimisticCart<CartApiQueryFragment | null> | null;
  subtotalCart: MoneyV2 | undefined;
}>({
  isCartDrawerOpen: false,
  setIsCartDrawerOpen: () => {},
  optimisticCart: null,
  subtotalCart: undefined,
});

export function CartDrawerProvider({children}: {children: React.ReactNode}) {
  const data = useRouteLoaderData<RootLoader>('root');
  const cart = use(data?.cart!);
  const optimisticCart = useOptimisticCart(cart);
  const subtotalCart = optimisticCart?.cost?.subtotalAmount as MoneyV2;
  const isHydrated = useIsHydrated();
  const [searchParams] = useSearchParams();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(
    searchParams.has('cart'),
  );

  const value = {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    optimisticCart,
    subtotalCart,
  };

  return (
    isHydrated && (
      <CartDrawerContext value={value}>
        <DiscountsView>
          <Drawer open={isCartDrawerOpen} onOpenChange={setIsCartDrawerOpen}>
            {children}
            <Suspense>
              <CartDrawer />
            </Suspense>
          </Drawer>
        </DiscountsView>
      </CartDrawerContext>
    )
  );
}
