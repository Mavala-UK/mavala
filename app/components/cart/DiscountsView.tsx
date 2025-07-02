import {createContext, use, useMemo, useState} from 'react';
import { useRouteLoaderData } from 'react-router';
import {RootLoader} from '~/root';
import {
  type MoneyV2,
  type DiscountAutomaticBxgy,
  type DiscountCustomerGets,
  type Product,
  type Collection,
  type ProductVariant,
  type DiscountOnQuantity,
  type DiscountProducts,
  type DiscountCollections,
} from 'admin.types';
import {useCartDrawer} from './CartDrawer';
import {Drawer} from '../ui/Drawer';
import {GiftDrawer} from './GiftDrawer';

export type DiscountWithTotalsType = DiscountAutomaticBxgy & {
  totalQuantity?: number;
  totalAmount?: number;
  hasGiftAvailable: boolean;
};

export type GiftItemType = Collection | Product | ProductVariant;

export type DiscountGiftType = DiscountCustomerGets & {
  items: GiftItemType[];
};

export type MatchingLinesType = DiscountCollections | DiscountProducts;

export function DiscountsView({children}: {children: React.ReactNode}) {
  /* cart data */
  const {optimisticCart} = useCartDrawer();
  const {nodes: lines} = optimisticCart?.lines ?? {};

  /* Drawer Gifts */
  const [isGiftDrawerOpen, setIsGiftDrawerOpen] = useState<boolean>(false);
  const {setIsCartDrawerOpen} = useCartDrawer();

  const handleOpenChange = (open: boolean) => {
    setIsGiftDrawerOpen(open);
    setIsCartDrawerOpen(!open);
  };

  /* all discounts */
  const data = useRouteLoaderData<RootLoader>('root');
  const {automaticDiscounts: automaticDiscountsPromise} = data ?? {};
  const allDiscounts = use(
    automaticDiscountsPromise!,
  )?.data?.automaticDiscountNodes.nodes.flatMap(
    ({automaticDiscount}) => automaticDiscount,
  );

  /* Free shipping */
  const freeShippingLimit = allDiscounts
    ?.filter(
      (discount) => discount.__typename === 'DiscountAutomaticFreeShipping',
    )
    .reduce((min, curr) =>
      Number(curr?.minimumRequirement?.greaterThanOrEqualToSubtotal.amount) <
      Number(min?.minimumRequirement?.greaterThanOrEqualToSubtotal.amount)
        ? curr
        : min,
    )?.minimumRequirement?.greaterThanOrEqualToSubtotal;

  /* Discounts Bxgy */
  const allBxgyDiscounts = allDiscounts
    ?.filter((discount) => discount.__typename === 'DiscountAutomaticBxgy')
    .filter((discount) => {
      const now = new Date();
      const {startsAt, endsAt, status} = discount ?? {};
      const discountStartsAt = new Date(startsAt);
      const discountEndsAt = endsAt ? new Date(endsAt) : null;

      return (
        status === 'ACTIVE' &&
        discountStartsAt <= now &&
        (!discountEndsAt || discountEndsAt >= now)
      );
    });

  function getMatchingLines(items: MatchingLinesType) {
    switch (items.__typename) {
      case 'DiscountCollections': {
        const collectionIds = items.collections?.nodes?.map(({id}) => id);
        return lines?.filter((line) =>
          line?.merchandise?.product?.collections?.nodes?.some(({id}) =>
            collectionIds.includes(id),
          ),
        );
      }

      case 'DiscountProducts': {
        const productIds = items.products?.nodes?.map(({id}) => id);
        const variantIds = items.productVariants?.nodes?.map(({id}) => id);

        return lines?.filter((line) => {
          const merchandise = line?.merchandise;
          return (
            variantIds.includes(merchandise?.id) ||
            productIds.includes(merchandise?.product?.id)
          );
        });
      }

      default:
        return null;
    }
  }

  const availableBxgyDiscounts = useMemo(
    () =>
      (allBxgyDiscounts ?? [])
        ?.map((discount) => {
          if (!discount) return null;

          const {customerBuys} = discount ?? {};
          const {value, items} = customerBuys ?? {};
          const matchingLinesBuys = getMatchingLines(
            items as MatchingLinesType,
          );

          if (matchingLinesBuys?.length === 0) {
            return null;
          }

          switch (value?.__typename) {
            case 'DiscountQuantity': {
              const totalQuantity = matchingLinesBuys?.reduce(
                (sum, line) => sum + line.quantity,
                0,
              );

              return {
                ...discount,
                totalQuantity,
                hasGiftAvailable:
                  Number(totalQuantity) >= Number(value.quantity),
              };
            }

            case 'DiscountPurchaseAmount': {
              const totalAmount = matchingLinesBuys?.reduce((sum, line) => {
                const price = Number(line?.merchandise?.price?.amount) || 0;
                return sum + price * line.quantity;
              }, 0);

              return {
                ...discount,
                totalAmount,
                hasGiftAvailable: Number(totalAmount) >= Number(value.amount),
              };
            }

            default:
              return null;
          }
        })
        .filter(Boolean),
    [allBxgyDiscounts, lines],
  );

  /* Gifts */
  const availableGifts = useMemo(() => {
    if (!availableBxgyDiscounts) return [];

    return availableBxgyDiscounts
      .filter(({hasGiftAvailable, customerGets}) => {
        const {value, items} = customerGets ?? {};
        const {quantity} = (value as DiscountOnQuantity) ?? {};
        const matchingLinesGets = getMatchingLines(items as MatchingLinesType);

        const giftInCart =
          matchingLinesGets?.some(
            (line) =>
              line?.discountAllocations?.length > 0 ||
              line?.cost?.totalAmount.amount === '0.0',
          ) ?? false;

        return (
          hasGiftAvailable && Number(quantity?.quantity) === 1 && !giftInCart
        );
      })
      .flatMap(({customerGets}) => {
        const {items: customerGetsItems} = customerGets ?? {};
        let items: GiftItemType[] = [];

        switch (customerGetsItems.__typename) {
          case 'DiscountCollections':
            items = customerGetsItems.collections?.nodes as Collection[];
            break;
          case 'DiscountProducts':
            items = [
              ...(customerGetsItems.products?.nodes as Product[]),
              ...(customerGetsItems.productVariants?.nodes as ProductVariant[]),
            ];
            break;
        }

        return [
          {
            ...customerGets,
            items,
          },
        ];
      });
  }, [availableBxgyDiscounts, lines]);

  const [selectedGiftCollection, setSelectedGiftCollection] =
    useState<Collection | null>(null);

  return (
    <DiscountsContext
      value={{
        freeShippingLimit,
        availableBxgyDiscounts:
          availableBxgyDiscounts as DiscountWithTotalsType[],
        availableGifts: availableGifts as DiscountGiftType[],
        isGiftDrawerOpen,
        setIsGiftDrawerOpen,
        selectedGiftCollection,
        setSelectedGiftCollection,
      }}
    >
      {children}
      <Drawer open={isGiftDrawerOpen} onOpenChange={handleOpenChange}>
        <GiftDrawer />
      </Drawer>
    </DiscountsContext>
  );
}

export function useDiscounts() {
  return use(DiscountsContext);
}

export const DiscountsContext = createContext<{
  freeShippingLimit: MoneyV2 | undefined;
  availableBxgyDiscounts: DiscountWithTotalsType[] | undefined;
  availableGifts: DiscountGiftType[] | undefined;
  isGiftDrawerOpen: boolean;
  setIsGiftDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGiftCollection: Collection | null;
  setSelectedGiftCollection: React.Dispatch<
    React.SetStateAction<Collection | null>
  >;
}>({
  freeShippingLimit: undefined,
  availableBxgyDiscounts: undefined,
  availableGifts: undefined,
  isGiftDrawerOpen: false,
  setIsGiftDrawerOpen: () => {},
  selectedGiftCollection: null,
  setSelectedGiftCollection: () => {},
});
