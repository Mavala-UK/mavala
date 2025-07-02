import {use, createContext} from 'react';
import type {
  ProductItemFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {cn} from '~/lib/utils';
import { useRouteLoaderData } from 'react-router';
import {RootLoader} from '~/root';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {GtmProductData} from '~/lib/gtm';
import {ShopQuery} from 'storefrontapi.generated';
import {useProductItem} from '~/hooks/useProductItem';
import {useCartDrawer} from '../cart/CartDrawer';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {Link} from '../common/Link';
import {Image} from '../ui/Image';
import {Button, ButtonEffect} from '../ui/Button';
import {FormattedMessage, useIntl} from 'react-intl';
import {ProductPrice} from './ProductPrice';
import {Text} from '../ui/Text';
import {Cart} from '../icons/Cart';
import {Badges} from '../ui/Badges';
import {ProductViewDrawer} from './drawer/ProductViewDrawer';
import {ProductView} from './ProductView';
import {AddToCartButton} from '../cart/AddToCartButton';
import ShadeCircle from '../ui/ShadeCircle';
import styles from './ProductCard.module.css';

type VariantType = 'card' | 'row' | 'strip' | 'compact';
type ThemeType = 'light' | undefined;
type SizeButtonCardType = 'sm' | undefined;

export function ProductCard({
  handle,
  initialData,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof ProductCardContent>,
  'product'
> & {
  handle: string | null;
  initialData?: ProductItemFragment;
}) {
  const {data: product} = useProductItem(handle, {initialData});

  if (!product) {
    return <div className={styles.skeleton} />;
  }

  return <ProductCardContent product={product} {...props} />;
}

/*  */
/*  */
/*  */
/*  */
/* Product Card content */
function ProductCardContent({
  product,
  className,
  variant = 'card',
  theme,
  size,
  showAddButton = true,
  priority = false,
}: React.ComponentPropsWithoutRef<'div'> & {
  product: ProductItemFragment;
  variant?: VariantType;
  theme?: ThemeType;
  size?: SizeButtonCardType;
  showAddButton?: boolean;
  priority?: boolean;
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const data = useRouteLoaderData<RootLoader>('root');
  const {sites, shop} = data ?? {};
  const {isMavalaCorporate} = sites ?? {};
  const {setIsCartDrawerOpen, isCartDrawerOpen} = useCartDrawer();
  const {handle, title, productType, capacity} = product ?? {};
  const pathWithLocale = usePathWithLocale(`/products/${handle}`);
  const variants = product.variants?.nodes;
  const selectedVariant = (variants.find(
    (variant) => variant.id === product.defaultVariant?.reference?.id,
  ) ?? variants[0]) as ProductVariantFragment;

  return (
    <ProductCardContext
      value={{product, selectedVariant, variant, theme, size, showAddButton}}
    >
      <div
        className={cn(styles.root, className)}
        data-variant={variant}
        {...(theme && {
          'data-theme': theme,
        })}
        {...(size && {
          'data-size': size,
        })}
      >
        {variant === 'card' && (
          <div className={styles['image-wrapper']}>
            <ProductCardImage priority={priority} />
            {isDesktop && <ShadesCount />}
            <Badges className={styles.badges} items={product?.badges} />
            <CardButtonContent />
          </div>
        )}
        <Link
          to={pathWithLocale}
          className={styles.link}
          onClick={() => {
            isCartDrawerOpen && setIsCartDrawerOpen(false);
            GtmProductData('click_product', {
              products: [product],
              shop: shop as ShopQuery['shop'],
            });
          }}
        >
          {variant !== 'card' && (
            <div className={styles['image-wrapper']}>
              <ProductCardImage priority={priority} />
            </div>
          )}
          <div className={styles['content-wrapper']}>
            <Text
              weight="light"
              size={(() => {
                if (!isDesktop) return 'sm';
                switch (variant) {
                  case 'row':
                    return 'lg';
                  case 'strip':
                    return size === 'sm' ? 'sm' : 'md';
                  case 'card':
                  default:
                    return 'md';
                }
              })()}
            >
              {title}
            </Text>
            {productType && variant !== 'compact' && (
              <Text
                className={styles.category}
                uppercase={variant !== 'card'}
                size={(() => {
                  switch (variant) {
                    case 'card':
                      return 'xs';
                    case 'strip':
                    case 'row':
                      return '5xs';
                    default:
                      return isDesktop ? 'xs' : 'sm';
                  }
                })()}
                weight="light"
                color="medium"
              >
                {productType}
              </Text>
            )}
            {variant !== 'compact' && (variant !== 'card' || !isDesktop) && (
              <ShadesCount />
            )}
            <div className={styles.infos}>
              {!isMavalaCorporate && (
                <Text
                  weight="light"
                  {...(variant === 'compact' && {color: 'medium'})}
                  size={(() => {
                    switch (variant) {
                      case 'card':
                        return 'sm';
                      case 'compact':
                        return 'xs';
                      case 'row':
                        return isDesktop ? 'md' : 'xs';
                      case 'strip':
                        return isDesktop ? (size === 'sm' ? 'sm' : 'md') : 'sm';
                      default:
                        return isDesktop ? 'md' : 'sm';
                    }
                  })()}
                >
                  <ProductPrice
                    price={selectedVariant.price}
                    compareAtPrice={selectedVariant.compareAtPrice}
                    className={styles.price}
                  />
                </Text>
              )}
              {capacity?.value && variant !== 'compact' && (
                <Text
                  asChild
                  size={variant === 'row' ? 'xs' : '3xs'}
                  color="medium"
                >
                  <span>{capacity?.value}</span>
                </Text>
              )}
            </div>
          </div>
        </Link>
        {variant !== 'card' && <CardButtonContent />}
      </div>
    </ProductCardContext>
  );
}

/*  */
/*  */
/*  */
/*  */
/* Image card */
function ProductCardImage({priority = false}: {priority?: boolean}) {
  const {variant, selectedVariant, product} = useProductCard();
  const image = selectedVariant?.image ?? product?.featuredImage;

  return (
    image && (
      <Image
        className={styles.image}
        data={image}
        aspectRatio="1/1"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        style={{aspectRatio: undefined, width: undefined}}
        sizes={(() => {
          switch (variant) {
            case 'row':
              return '(min-width: 64rem) 9.375rem, 7.5rem';
            case 'strip':
              return '12.5rem';
            case 'compact':
              return '3.5rem';
            case 'card':
            default:
              return '(min-width: 120rem) 27.25rem, (min-width: 64rem) 21.5vw, (min-width: 48.75rem) 30vw, 50vw';
          }
        })()}
      />
    )
  );
}

/*  */
/*  */
/*  */
/*  */
/* Shades count */
function ShadesCount() {
  const {product} = useProductCard();
  const variants = product?.variants?.nodes;
  const {formatMessage} = useIntl();

  if (variants?.length! <= 1) {
    return null;
  }

  return (
    <div className={styles.shades}>
      <div className={styles['shades-circles']}>
        {Array.from({length: 3}).map((_, index) => (
          <ShadeCircle className={styles.pattern} key={index} size="sm" />
        ))}
      </div>
      <Text weight="medium" size="4xs" uppercase className={styles.text}>
        {`${variants?.length!} ${formatMessage({
          id: 'shades',
        })}`}
      </Text>
    </div>
  );
}

/*  */
/*  */
/*  */
/*  */
/* card button actions*/
function CardButtonContent() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {isMavalaCorporate} = data?.sites ?? {};
  const {product, selectedVariant, variant, theme, size, showAddButton} =
    useProductCard();
  const {handle} = product ?? {};
  const variants = product?.variants?.nodes;
  const {availableForSale} = selectedVariant ?? {};

  return (
    !isMavalaCorporate &&
    showAddButton && (
      <>
        {variants?.length! > 1 ? (
          <ProductView
            handle={handle!}
            selectedOptions={selectedVariant?.selectedOptions!}
          >
            <ProductViewDrawer layout="card" enabled={availableForSale}>
              <Button
                theme={theme !== 'light' ? 'light' : 'grayed'}
                size={(() => {
                  switch (variant) {
                    case 'card':
                      return '4xs';
                    case 'strip':
                      return size === 'sm' ? '4xs' : '2xs';
                    case 'row':
                    default:
                      return '2xs';
                  }
                })()}
                aria-disabled={!availableForSale}
                className={styles.button}
              >
                <AddButtonContent />
              </Button>
            </ProductViewDrawer>
          </ProductView>
        ) : (
          <AddToCartButton
            theme={theme !== 'light' ? 'light' : 'grayed'}
            size={(() => {
              switch (variant) {
                case 'card':
                  return '4xs';
                case 'strip':
                  return size === 'sm' ? '4xs' : '2xs';
                case 'row':
                default:
                  return '2xs';
              }
            })()}
            aria-disabled={!availableForSale}
            className={styles.button}
            selectedVariant={selectedVariant!}
          >
            <AddButtonContent />
          </AddToCartButton>
        )}
      </>
    )
  );
}

/*  */
/*  */
/*  */
/*  */
/* Add button */
function AddButtonContent() {
  const {selectedVariant, variant} = useProductCard();
  const {availableForSale} = selectedVariant ?? {};
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  switch (variant) {
    case 'card':
      return isDesktop ? (
        availableForSale ? (
          <ButtonEffect>
            <FormattedMessage id="add" />
          </ButtonEffect>
        ) : (
          <FormattedMessage id="out_of_stock" />
        )
      ) : (
        <Cart />
      );

    case 'strip':
      return availableForSale ? (
        <ButtonEffect>
          {isDesktop ? (
            <FormattedMessage id="add" />
          ) : (
            <FormattedMessage id="add_to_cart" />
          )}
        </ButtonEffect>
      ) : (
        <FormattedMessage id="out_of_stock" />
      );

    case 'row':
    default:
      return availableForSale ? (
        <ButtonEffect>
          <FormattedMessage id="add_to_cart" />
        </ButtonEffect>
      ) : (
        <FormattedMessage id="out_of_stock" />
      );
  }
}

function useProductCard() {
  return use(ProductCardContext);
}

const ProductCardContext = createContext<{
  product: ProductItemFragment | undefined;
  selectedVariant: ProductVariantFragment | undefined;
  variant: VariantType;
  theme: ThemeType;
  size?: SizeButtonCardType;
  showAddButton?: boolean;
}>({
  product: undefined,
  selectedVariant: undefined,
  variant: 'card',
  theme: undefined,
  size: undefined,
  showAddButton: true,
});
