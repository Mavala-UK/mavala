import {useEffect} from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {VariantSelector} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import type {ProductItemFragment, ProductVariantFragment} from 'storefrontapi.generated';
import {ProductView, useProductView} from '../product/ProductView';
import {useBundleContext} from './BundleContext';
import {Image} from '../ui/Image';
import {Text} from '../ui/Text';
import ShadeCircle from '../ui/ShadeCircle';
import styles from './BundleComponentItem.module.css';

export function BundleComponentItem({
  component,
}: {
  component: ProductItemFragment;
}) {
  return (
    <ProductView handle={component.handle} selectedOptions={[]}>
      <BundleComponentItemInner component={component} />
    </ProductView>
  );
}

function BundleComponentItemInner({
  component,
}: {
  component: ProductItemFragment;
}) {
  const {setSelectedVariant} = useBundleContext();
  const {product, selectedVariant, selectedOptions, setSelectedOptions} =
    useProductView();

  // Sync selected variant up to BundleContext
  useEffect(() => {
    setSelectedVariant(component.handle, selectedVariant);
  }, [selectedVariant, component.handle, setSelectedVariant]);

  const handleValueChange = (value: string) => {
    const option = JSON.parse(value) as SelectedOption;
    setSelectedOptions((prev) => [
      ...prev.filter((o) => o.name !== option.name),
      option,
    ]);
  };

  const {options, variants, featuredImage, title} = product ?? {};
  const allVariants = variants?.nodes ?? [];

  if (!allVariants.length || allVariants[0].title === 'Default Title') {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        {featuredImage && (
          <Image
            data={featuredImage}
            aspectRatio="1/1"
            sizes="6rem"
            className={styles.image}
          />
        )}
        <Text weight="medium" size="sm">
          {title}
        </Text>
      </div>

      <VariantSelector
        handle={component.handle}
        options={options ?? []}
        variants={allVariants}
      >
        {({option}) => (
          <RadioGroup.Root
            key={option.name}
            value={JSON.stringify(
              selectedOptions.find((o) => o.name === option.name),
            )}
            onValueChange={handleValueChange}
            className={styles.options}
          >
            {option.values.map((optionValue) => {
              const variant = optionValue.variant as ProductVariantFragment;
              return (
                <RadioGroup.Item
                  key={option.name + optionValue.value}
                  value={JSON.stringify({name: option.name, value: optionValue.value})}
                  className={styles.shadeButton}
                >
                  <ShadeCircle tint={variant?.tint} size="xl" />
                </RadioGroup.Item>
              );
            })}
          </RadioGroup.Root>
        )}
      </VariantSelector>

      {selectedVariant && (
        <div className={styles.selectedShade}>
          <Text size="2xs" weight="medium" uppercase>
            Selected:
          </Text>
          <Text size="2xs" color="medium" className={styles.shadeName}>
            <ShadeCircle tint={selectedVariant.tint} size="xs" />
            <span>{selectedVariant.title}</span>
          </Text>
        </div>
      )}
    </div>
  );
}
