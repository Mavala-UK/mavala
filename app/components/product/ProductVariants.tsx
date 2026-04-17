import {useEffect, useId} from 'react';
import {cn} from '~/lib/utils';
import {Chromatic} from '../icons/Chromatic';
import {FormattedMessage} from 'react-intl';
import {Text} from '../ui/Text';
import {Link} from '../ui/Link';
import {ProductViewDrawer} from './drawer/ProductViewDrawer';
import {VariantSelector} from '@shopify/hydrogen';
import ShadeCircle from '../ui/ShadeCircle';
import {useSearchParams} from 'react-router';
import {useProductView} from '../product/ProductView';
import {Carousel, CarouselWrapperButton} from '../ui/Carousel';
import {ShadeOption} from '../ui/ShadeOption';
import styles from './ProductVariants.module.css';

export function ProductVariants({className}: {className?: string}) {
  const maxShadesShown = 6;
  const id = useId();
  const [searchParams] = useSearchParams();
  const {product, setSelectedOptions, selectedVariant} = useProductView();
  const {handle, options: initialOptions, favoriteShades} = product ?? {};
  const allVariants = product?.variants?.nodes;
  const favoriteVariants = favoriteShades?.references?.nodes ?? [];

  const filteredVariants = allVariants?.filter(
    (variant) =>
      !favoriteVariants?.some((favorite) => favorite.id === variant.id),
  );

  const favoritesAndFilteredVariants = [
    ...favoriteVariants!,
    ...filteredVariants!,
  ];

  const variants = favoritesAndFilteredVariants.slice(0, maxShadesShown);

  const options = initialOptions
    ?.map((option) => {
      return {
        ...option,
        optionValues: option.optionValues.filter((value) =>
          variants.some((variant) =>
            variant.selectedOptions.some(
              (selectedOption) => selectedOption.value === value.name,
            ),
          ),
        ),
      };
    })
    .filter((option) => option.optionValues.length > 0);

  useEffect(() => {
    const newSelectedOptions = Array.from(searchParams.entries()).map(
      ([name, value]) => ({name, value}),
    );

    setSelectedOptions(newSelectedOptions);
  }, [searchParams, setSelectedOptions]);

  if (variants?.[0].title === 'Default Title') {
    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <Text asChild uppercase size="2xs" weight="medium">
        <h2>
          {favoritesAndFilteredVariants.length > maxShadesShown ? (
            <FormattedMessage id="favorite_shades" />
          ) : (
            <FormattedMessage id="available_shades" />
          )}
        </h2>
      </Text>
      <VariantSelector
        handle={handle ?? ''}
        options={options}
        variants={variants}
      >
        {({option}) => (
          <CarouselWrapperButton id={id} key={option.name}>
            <Carousel
              mousewheel
              slidesPerView="auto"
              spaceBetween={8}
              navigation={{
                nextEl: `[id="swiper-button-next-${id}"]`,
              }}
            >
              {option.values.map((optionValue) => (
                <ShadeOption
                  option={option}
                  value={optionValue}
                  to={optionValue.to}
                  key={option.name + optionValue.value}
                />
              ))}
            </Carousel>
          </CarouselWrapperButton>
        )}
      </VariantSelector>
      <ProductViewDrawer>
        <Text size="sm" weight="light" asChild>
          <Link variant="underline" asChild size="sm">
            {allVariants?.length! > maxShadesShown && (
              <button className={styles.trigger}>
                <Chromatic />
                <span>
                  <FormattedMessage id="all_shades" />
                  {` (${allVariants?.length})`}
                </span>
              </button>
            )}
          </Link>
        </Text>
      </ProductViewDrawer>
      <div className={styles['selected-shade']}>
        <Text asChild uppercase size="2xs" weight="medium">
          <h2>
            <FormattedMessage id="selected_shade" />
          </h2>
        </Text>
        <Text
          uppercase
          size="2xs"
          color="medium"
          weight="medium"
          className={styles.shade}
        >
          <span>{selectedVariant?.title}</span>
          <ShadeCircle tint={selectedVariant?.tint} size="xs" />
        </Text>
      </div>
    </div>
  );
}
