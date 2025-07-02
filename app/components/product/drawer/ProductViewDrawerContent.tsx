import { useRouteLoaderData } from 'react-router';
import {RootLoader} from '~/root';
import {
  DrawerTitle,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerBody,
  DrawerFooter,
} from '../../ui/Drawer';
import {useOptimisticVariant} from '@shopify/hydrogen';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {useProductViewDrawer} from './ProductViewDrawer';
import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import {FormattedMessage} from 'react-intl';
import {AddToCartButton} from '../../cart/AddToCartButton';
import {Image} from '../../ui/Image';
import {DrawerSearch} from './partials/DrawerSearch';
import {DrawerColors} from './partials/DrawerColors';
import {DrawerFilters} from './partials/DrawerFilters';
import {DrawerVariants} from './partials/DrawerVariants';
import styles from './ProductViewDrawerContent.module.css';

export function ProductViewDrawerContent() {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const data = useRouteLoaderData<RootLoader>('root');
  const {isMavalaCorporate} = data?.sites ?? {};
  const {searchValue, selectedProduct, selectedOptions} =
    useProductViewDrawer();

  const selectedProductVariant = selectedProduct?.variants?.nodes.find(
    (variant) =>
      JSON.stringify(variant.selectedOptions) ===
      JSON.stringify(selectedOptions),
  );

  const selectedVariant = useOptimisticVariant(
    selectedProductVariant,
    selectedProduct?.variants,
  );

  const {image: variantImg, textureImg} = selectedVariant ?? {};
  const image = textureImg?.reference?.image ?? variantImg;
  return (
    <DrawerContent
      className={styles.root}
      onCloseAutoFocus={(e) => e.preventDefault()}
      onOpenAutoFocus={(e) => !isDesktop && e.preventDefault()}
    >
      <DrawerHeader className={styles.header}>
        <VisuallyHidden asChild>
          <DrawerTitle>
            <FormattedMessage id="fast_add_drawer" />
          </DrawerTitle>
        </VisuallyHidden>
        <DrawerSearch />
        <DrawerClose />
      </DrawerHeader>
      <div className={styles['image-wrapper']}>
        {image && (
          <Image
            data={image}
            aspectRatio="1/1"
            sizes={`(min-width: 64rem) 25.125rem, 100vw`}
            loading="eager"
            style={{width: undefined}}
          />
        )}
      </div>
      <DrawerBody className={styles.body}>
        {searchValue.length === 0 && (
          <>
            <DrawerColors className={styles.colors} />
            <DrawerFilters className={styles.filters} />
          </>
        )}
        <DrawerVariants className={styles.content} />
      </DrawerBody>
      {!isMavalaCorporate && (
        <DrawerFooter className={styles.footer}>
          <AddToCartButton
            className={styles.button}
            selectedVariant={selectedVariant}
          />
        </DrawerFooter>
      )}
    </DrawerContent>
  );
}
