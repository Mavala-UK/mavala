import {useId} from 'react';
import {cn, startViewTransition, sortColorsByName} from '~/lib/utils';
import { useNavigate, useParams } from 'react-router';
import {FormattedMessage} from 'react-intl';
import {useProductViewDrawer} from '../ProductViewDrawer';
import type {MainColorFragment} from 'storefrontapi.generated';
import {Carousel, CarouselWrapperButton} from '~/components/ui/Carousel';
import {Text} from '~/components/ui/Text';
import {Color} from '~/components/ui/Color';
import styles from './DrawerColors.module.css';

export function DrawerColors({className}: {className?: string}) {
  const id = useId();
  const {locale} = useParams();
  const navigate = useNavigate();

  const {
    layout,
    products,
    selectedProduct,
    setSelectedProduct,
    selectedProducts,
    setSelectedProducts,
    setSelectedOptions,
  } = useProductViewDrawer();

  const associatedProducts = sortColorsByName(
    selectedProduct?.associatedProducts?.references?.nodes!,
  );

  const isMatchingColor = (associatedProduct: MainColorFragment) =>
    selectedProducts?.length === 1 &&
    selectedProduct?.mainColor?.reference?.id ===
      associatedProduct?.mainColor?.reference?.id;

  const activeColor = associatedProducts?.find(isMatchingColor);
  const activeIndex = associatedProducts?.findIndex(isMatchingColor) ?? 0;

  const handleClick = (associatedProduct?: MainColorFragment) => {
    const newProduct = products?.find(
      (product) => product?.handle === associatedProduct?.handle,
    );

    const newSelectedOptions = newProduct?.variants?.nodes[0].selectedOptions;

    if (layout === 'page') {
      const searchParams = new URLSearchParams(
        newSelectedOptions?.map((option) => [option.name, option.value]),
      );

      const path = newProduct
        ? `${locale ? `/${locale}` : ''}/products/${newProduct?.handle}`
        : '';

      navigate(`${path}?${searchParams.toString()}`, {
        replace: true,
        preventScrollReset: true,
        viewTransition: true,
      });
    }

    startViewTransition(() => {
      if (newProduct) {
        setSelectedProduct(newProduct);
        setSelectedProducts([newProduct]);

        if (selectedProduct?.handle !== newProduct?.handle)
          setSelectedOptions(newSelectedOptions!);
      } else {
        setSelectedProducts(products);
      }
    });
  };

  return (
    associatedProducts?.length! > 1 && (
      <div className={cn(styles.root, className)}>
        <CarouselWrapperButton id={id}>
          <Carousel
            mousewheel
            slidesPerView={'auto'}
            spaceBetween={20}
            slideToClickedSlide
            initialSlide={activeIndex > 5 ? activeIndex : 0}
            navigation={{
              nextEl: `[id="swiper-button-next-${id}"]`,
            }}
          >
            <Text size="sm" asChild>
              <button
                type="button"
                className={styles.button}
                data-active={selectedProducts?.length! > 1}
                onClick={() => handleClick()}
              >
                <FormattedMessage id="see_all" />
              </button>
            </Text>
            {associatedProducts?.map((associatedProduct) => (
              <button
                key={associatedProduct.id}
                type="button"
                className={styles.button}
                data-active={associatedProduct?.id === activeColor?.id}
                onClick={() => handleClick(associatedProduct)}
              >
                <Color productColor={associatedProduct} />
              </button>
            ))}
          </Carousel>
        </CarouselWrapperButton>
      </div>
    )
  );
}
