import {useEffect, useId} from 'react';
import {cn} from '~/lib/utils';
import {Chromatic} from '../icons/Chromatic';
import {FormattedMessage} from 'react-intl';
import {Text} from '../ui/Text';
import {Link} from '../ui/Link';
import {ProductViewDrawer} from './drawer/ProductViewDrawer';
import {VariantSelector} from '@shopify/hydrogen';
import ShadeCircle from '../ui/ShadeCircle';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {useNavigate, useSearchParams, useRouteLoaderData} from 'react-router';
import {useProductView} from '../product/ProductView';
import {Carousel, CarouselWrapperButton} from '../ui/Carousel';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {ShadeOption} from '../ui/ShadeOption';
import {buildShadePath, isShadeOptionName} from '~/lib/shadeUrl';
import {withTrackingParams} from '~/lib/trackingParams';
import type {RootLoader} from '~/root';
import styles from './ProductVariants.module.css';

export function ProductVariants({className}: {className?: string}) {
  const maxShadesShown = 6;
  const id = useId();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const pathPrefix = rootData?.selectedLocale?.pathPrefix ?? '';
  const {product, setSelectedOptions, selectedVariant, selectedOptions} =
    useProductView();
  const {handle, options: initialOptions, favoriteShades} = product ?? {};

  // Active shade value from the path-resolved variant (the source of truth)
  const activeShadeOptionName = initialOptions?.find(
    (o) => isShadeOptionName(o.name),
  )?.name;
  const activeShadeValue = selectedVariant?.selectedOptions?.find(
    (o) => o.name === activeShadeOptionName,
  )?.value;
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

  // For non-shade options (e.g. Packaging) that are still query-param driven:
  const handleValueChange = (value: string) => {
    const option = JSON.parse(value) as SelectedOption;

    const newSelectedOptions = [
      ...selectedOptions.filter(
        (selectedOption) => selectedOption.name !== option.name,
      ),
      option,
    ];

    const newSearchParams = new URLSearchParams(
      newSelectedOptions?.map((o) => [o.name, o.value]),
    );

    setSelectedOptions(newSelectedOptions);

    // Preserve the allowlisted marketing params so an in-page non-shade
    // selection keeps ad/email attribution (the rebuilt query would otherwise
    // drop gclid/utm_*).
    navigate(withTrackingParams(`?${newSearchParams.toString()}`, searchParams), {
      replace: true,
      preventScrollReset: true,
      viewTransition: true,
    });
  };

  useEffect(() => {
    // Filter to ONLY the product's own option names to prevent tracking params
    // (fbclid, utm_*, etc.) from polluting selectedOptions and breaking the drawer ATC.
    const productOptionNames = new Set(
      initialOptions?.map((o) => o.name) ?? [],
    );
    const newSelectedOptions = Array.from(searchParams.entries())
      .filter(([name]) => productOptionNames.has(name))
      .map(([name, value]) => ({name, value}));

    setSelectedOptions(newSelectedOptions);
  }, [searchParams, setSelectedOptions, initialOptions]);

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
        {({option}) => {
          const isShadeOpt = isShadeOptionName(option.name);

          const carousel = (
            <CarouselWrapperButton id={id}>
              <Carousel
                mousewheel
                slidesPerView="auto"
                spaceBetween={8}
                navigation={{
                  nextEl: `[id="swiper-button-next-${id}"]`,
                }}
              >
                {option.values.map((optionValue) => {
                  // For shade options: path-based link (crawlable, tracking-safe).
                  // isActive is derived from the path-resolved selectedVariant, not
                  // from searchParams (which may be empty or contain only tracking params).
                  // Re-append the allowlisted marketing params so an in-page shade
                  // switch keeps ad/email attribution. When none are present (the
                  // crawler/SSR case), the href stays the clean canonical path.
                  const to = isShadeOpt
                    ? withTrackingParams(
                        buildShadePath(handle ?? '', optionValue.value, pathPrefix),
                        searchParams,
                      )
                    : undefined;
                  const isPathActive = isShadeOpt
                    ? optionValue.value.toLowerCase() ===
                      (activeShadeValue?.toLowerCase() ?? '')
                    : optionValue.isActive;
                  return (
                    <ShadeOption
                      option={option}
                      value={{...optionValue, isActive: isPathActive}}
                      to={to}
                      key={option.name + optionValue.value}
                    />
                  );
                })}
              </Carousel>
            </CarouselWrapperButton>
          );

          if (isShadeOpt) {
            // All shade products: crawlable <Link> swatches, no RadioGroup
            return <div key={option.name}>{carousel}</div>;
          }

          // Non-shade options (e.g. Packaging): keep RadioGroup for query-param selection
          return (
            <RadioGroup.Root
              key={option.name}
              value={JSON.stringify(
                selectedOptions.find(
                  (selectedOption) => selectedOption.name === option.name,
                ),
              )}
              onValueChange={handleValueChange}
            >
              {carousel}
            </RadioGroup.Root>
          );
        }}
      </VariantSelector>
      <ProductViewDrawer>
        <Text size="sm" weight="light" asChild>
          <Link variant="underline" asChild size="sm">
            {allVariants?.length! > maxShadesShown && (
              <button className={styles.trigger} data-testid="shade-drawer-trigger">
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
