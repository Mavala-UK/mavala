import {useEffect} from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {VariantSelector} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import type {ProductItemFragment, ProductVariantFragment} from 'storefrontapi.generated';
import {ProductView, useProductView} from '../product/ProductView';
import {useBundleContext} from './BundleContext';
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '../ui/Accordion';
import {cn} from '~/lib/utils';
import {Image} from '../ui/Image';
import {Text} from '../ui/Text';
import ShadeCircle from '../ui/ShadeCircle';
import styles from './BundleComponentItem.module.css';

export function BundleComponentItem({
  component,
  isActive,
  isSelected,
  isAnySelected,
  index,
}: {
  component: ProductItemFragment;
  isActive: boolean;
  isSelected: boolean;
  isAnySelected: boolean;
  index: number;
}) {
  return (
    <ProductView handle={component.handle} selectedOptions={[]}>
      <BundleComponentItemInner
        component={component}
        isActive={isActive}
        isSelected={isSelected}
        isAnySelected={isAnySelected}
        index={index}
      />
    </ProductView>
  );
}

function BundleComponentItemInner({
  component,
  isActive,
  isSelected,
  isAnySelected,
  index,
}: {
  component: ProductItemFragment;
  isActive: boolean;
  isSelected: boolean;
  isAnySelected: boolean;
  index: number;
}) {
  const {setSelectedVariant, selectedVariants} = useBundleContext();
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
  const allVariants = (variants?.nodes ?? []).filter(
    (v) => v.hideFromBundle?.value !== 'true',
  );

  if (!allVariants.length || allVariants[0].title === 'Default Title') {
    return null;
  }

  // The picked variant (may be from context if this component is collapsed)
  const pickedVariant =
    selectedVariants[component.handle] ?? selectedVariant ?? null;

  return (
    <AccordionItem
      value={component.handle}
      className={cn(
        styles.item,
        isSelected ? styles.itemSelected : undefined,
        !isActive && !isSelected ? styles.itemLocked : undefined,
      )}
    >
      <AccordionHeader asChild>
        <h3>
          <AccordionTrigger
            className={cn(
              styles.trigger,
              isSelected ? styles.triggerSelected : undefined,
              !isActive && !isSelected ? styles.triggerLocked : undefined,
            )}
          >
            <span className={styles.triggerInner}>
              {featuredImage && pickedVariant && isSelected ? (
                <Image
                  data={featuredImage}
                  aspectRatio="1/1"
                  sizes="3rem"
                  className={styles.triggerImage}
                />
              ) : featuredImage ? (
                <Image
                  data={featuredImage}
                  aspectRatio="1/1"
                  sizes="3rem"
                  className={styles.triggerImage}
                />
              ) : null}
              <span className={styles.triggerText}>
                <Text
                  weight="medium"
                  size="sm"
                  className={cn(!isActive && !isSelected ? styles.lockedText : undefined)}
                >
                  {title}
                </Text>
                {isSelected && pickedVariant && (
                  <Text size="2xs" color="medium" className={styles.shadeName}>
                    <ShadeCircle tint={pickedVariant.tint} size="xs" />
                    <span>{pickedVariant.title}</span>
                  </Text>
                )}
              </span>
            </span>
          </AccordionTrigger>
        </h3>
      </AccordionHeader>
      <AccordionContent>
        <div className={styles.pickerBody}>
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
                {option.values
                  .filter((optionValue) => {
                    const variant = optionValue.variant as ProductVariantFragment;
                    return variant?.hideFromBundle?.value !== 'true';
                  })
                  .map((optionValue) => {
                    const variant = optionValue.variant as ProductVariantFragment;
                    return (
                      <RadioGroup.Item
                        key={option.name + optionValue.value}
                        value={JSON.stringify({
                          name: option.name,
                          value: optionValue.value,
                        })}
                        className={styles.shadeButton}
                      >
                        <ShadeCircle tint={variant?.tint} size="xl" />
                      </RadioGroup.Item>
                    );
                  })}
              </RadioGroup.Root>
            )}
          </VariantSelector>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
