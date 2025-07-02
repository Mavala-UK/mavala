import {useDiscounts, type GiftItemType} from './DiscountsView';
import {Image} from '../ui/Image';
import {useCollectionItem} from '~/hooks/useCollectionItem';
import {ProductVariantFragment} from 'storefrontapi.generated';
import {Text} from '../ui/Text';
import {useIntl, FormattedMessage, FormattedNumber} from 'react-intl';
import {Heading} from '../ui/Heading';
import {AddToCartButton} from './AddToCartButton';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {Collection} from 'admin.types';
import {useProductItem} from '~/hooks/useProductItem';
import {useVariantUrl} from '~/hooks/useVariantUrl';
import {
  type DiscountOnQuantity,
  type DiscountAmount,
  type DiscountPercentage,
} from 'admin.types';
import {Link} from '../common/Link';
import {useCartDrawer} from './CartDrawer';
import {DiscountGiftType} from './DiscountsView';
import {DrawerGiftTrigger} from './GiftDrawer';
import {ProductView} from '../product/ProductView';
import {ProductViewDrawer} from '../product/drawer/ProductViewDrawer';
import {Button, ButtonEffect} from '../ui/Button';
import styles from './Gifts.module.css';

export function Gifts({isBusy}: {isBusy: boolean}) {
  const {availableGifts} = useDiscounts();

  if (!availableGifts?.length) return null;

  return (
    <ul className={styles.root} aria-live="polite" aria-busy={isBusy}>
      {availableGifts.map((gift) => {
        const {items} = gift ?? {};

        return items?.map((item) => (
          <GiftCartLine key={item.id} item={item} gift={gift} />
        ));
      })}
    </ul>
  );
}

function GiftCartLine({
  item,
  gift,
}: {
  item: GiftItemType;
  gift: DiscountGiftType;
}) {
  const {formatMessage} = useIntl();
  const {setIsCartDrawerOpen} = useCartDrawer();
  const {quantity, effect} = (gift?.value as DiscountOnQuantity) ?? {};

  if (!item) return null;

  const isCollection = item.__typename === 'Collection';
  const isProduct = item.__typename === 'Product';
  const isProductVariant = item.__typename === 'ProductVariant';

  const {data: collection} = isCollection
    ? useCollectionItem(item.handle!, {first: 50})
    : {};

  const {data: product} = isProduct ? useProductItem(item?.handle!) : {};

  const {data: productVariant} = isProductVariant
    ? useProductItem(item.product.handle!)
    : {};

  let url: string | undefined;
  let selectedVariant: ProductVariantFragment | undefined;

  if (isCollection) {
    url = usePathWithLocale(`/collections/${item?.handle}`);
  } else if (isProduct) {
    selectedVariant = product?.variants?.nodes[0] as ProductVariantFragment;
    url = useVariantUrl(item?.handle!, selectedVariant?.selectedOptions ?? []);
  } else if (isProductVariant) {
    selectedVariant = productVariant?.variants?.nodes?.find(
      (variant) => variant.id === item.id,
    ) as ProductVariantFragment;

    url = useVariantUrl(
      item?.product?.handle!,
      selectedVariant?.selectedOptions ?? [],
    );
  }

  const normalizedItem = (() => {
    switch (item.__typename) {
      case 'Collection':
        return {
          ...item,
          ...collection,
          title: formatMessage(
            {id: 'gift_collection_title'},
            {count: Number(quantity?.quantity) ?? 1},
          ),
          link: url,
          category: collection?.title,
          media: collection?.image,
          products: collection?.products?.nodes,
        };

      case 'Product':
        return {
          ...item,
          ...product,
          title: product?.title,
          link: url,
          category: product?.productType,
          media: product?.featuredImage,
          products: null,
        };

      case 'ProductVariant':
        return {
          ...item,
          ...productVariant,
          title: productVariant?.title,
          link: url,
          category: productVariant?.productType,
          media: selectedVariant?.image,
          products: null,
        };

      default:
        return null;
    }
  })();

  if (!normalizedItem) return null;

  const {media, category, title, link} = normalizedItem ?? {};

  return (
    <li className={styles.line}>
      <div className={styles.image}>
        {media && (
          <Image
            data={media}
            aspectRatio="1/1"
            sizes="5.125rem"
            style={{width: undefined}}
          />
        )}
      </div>
      <div className={styles.content}>
        {category && (
          <Text size="5xs" uppercase color="medium" className={styles.type}>
            {category}
          </Text>
        )}
        {title && (
          <Heading asChild size="sm">
            <Link
              to={link!}
              className={styles.title}
              onClick={() => setIsCartDrawerOpen(false)}
            >
              {title}
            </Link>
          </Heading>
        )}
        {isProductVariant && (
          <Text weight="light" size="xs" color="medium">
            {selectedVariant?.title}
          </Text>
        )}
      </div>
      <Text size="sm" weight="medium" className={styles.price}>
        <DiscountAllocation effect={effect} />
      </Text>
      {(() => {
        switch (normalizedItem.__typename) {
          case 'Collection':
            return (
              <DrawerGiftTrigger
                className={styles.button}
                collection={item as Collection}
              />
            );
          case 'Product':
            return product?.variants?.nodes.length! > 1 ? (
              <ProductView
                handle={product?.handle!}
                selectedOptions={selectedVariant?.selectedOptions!}
              >
                <ProductViewDrawer layout="page">
                  <Button theme="grayed" size="4xs" className={styles.button}>
                    <ButtonEffect>
                      <FormattedMessage id="add" />
                    </ButtonEffect>
                  </Button>
                </ProductViewDrawer>
              </ProductView>
            ) : (
              <AddToCartButtonGift selectedVariant={selectedVariant!} />
            );
          case 'ProductVariant':
            return <AddToCartButtonGift selectedVariant={selectedVariant!} />;
        }
      })()}
    </li>
  );
}

function AddToCartButtonGift({
  selectedVariant,
}: {
  selectedVariant: ProductVariantFragment;
}) {
  return (
    <AddToCartButton
      theme="grayed"
      size="4xs"
      className={styles.button}
      selectedVariant={selectedVariant!}
    >
      <ButtonEffect>
        <FormattedMessage id="add" />
      </ButtonEffect>
    </AddToCartButton>
  );
}

function DiscountAllocation({
  effect,
}: {
  effect: DiscountPercentage | DiscountAmount;
}) {
  if (!effect) return null;

  switch (effect?.__typename) {
    case 'DiscountPercentage':
      const {percentage} = effect ?? {};

      return Number(percentage) === 1 ? (
        <FormattedMessage id="free" />
      ) : (
        <FormattedNumber style="percent" value={-percentage} />
      );

    case 'DiscountAmount':
      const {amount, currencyCode} = effect?.amount ?? {};

      return (
        <>
          <FormattedNumber
            value={-amount}
            style="currency"
            maximumFractionDigits={amount % 1 === 0 ? 0 : 2}
            currency={currencyCode}
          />
          <Text size="2xs" color="medium" asChild>
            <span>
              <FormattedMessage id="per_article" />
            </span>
          </Text>
        </>
      );
  }
}
