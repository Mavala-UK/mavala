import {VariantSelector} from '@shopify/hydrogen';
import {useProductViewDrawer} from '../ProductViewDrawer';
import {startViewTransition} from '~/lib/utils';
import { useNavigate, useParams } from 'react-router';
import * as RadioGroup from '@radix-ui/react-radio-group';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {ShadeOption} from '~/components/ui/ShadeOption';

export function DrawerVariants({className}: {className?: string}) {
  const {locale} = useParams();
  const navigate = useNavigate();

  const {
    layout,
    searchValue,
    setSelectedProduct,
    selectedProducts,
    selectedOptions,
    setSelectedOptions,
    filters,
  } = useProductViewDrawer();

  const handleValueChange = (value: string) => {
    const option = JSON.parse(value) as SelectedOption;

    const newProduct = selectedProducts?.find((product) =>
      product.variants.nodes.some(
        (variant) =>
          JSON.stringify(variant.selectedOptions[0]) === JSON.stringify(option),
      ),
    );

    const newSelectedOptions = [
      ...selectedOptions.filter(
        (selectedOption) => selectedOption.name !== option.name,
      ),
      option,
    ];

    if (layout === 'page') {
      const path = newProduct
        ? `${locale ? `/${locale}` : ''}/products/${newProduct?.handle}`
        : '';

      const searchParams = new URLSearchParams(
        newSelectedOptions?.map((option) => [option.name, option.value]),
      );

      navigate(`${path}?${searchParams.toString()}`, {
        replace: true,
        preventScrollReset: true,
        viewTransition: true,
      });
    }

    startViewTransition(() => {
      setSelectedProduct(newProduct);
      setSelectedOptions(newSelectedOptions);
    });
  };

  return (
    <div className={className}>
      {selectedProducts?.map((product) => {
        const {handle, options, variants} = product ?? {};
        const {finishes, hasProtector} = filters ?? {};

        const filteredVariants = variants?.nodes.filter(
          ({finish, protector}) =>
            (!finishes.length || finishes.includes(finish?.value!)) &&
            (hasProtector === null ||
              String(filters.hasProtector) === protector?.value),
        );

        return (
          <VariantSelector
            handle={handle ?? ''}
            options={options?.filter(
              (option) => option.optionValues.length > 1,
            )}
            variants={filteredVariants}
            key={product.id}
          >
            {({option}) => (
              <RadioGroup.Root
                key={option.name}
                onValueChange={handleValueChange}
                value={JSON.stringify(
                  selectedOptions.find(
                    (selectedOption) => selectedOption.name === option.name,
                  ),
                )}
              >
                {option.values
                  .filter((value) =>
                    value.optionValue.name
                      ?.toLowerCase()
                      .includes(searchValue.toLowerCase()),
                  )
                  .map(
                    (optionValue) =>
                      optionValue.variant && (
                        <ShadeOption
                          option={option}
                          value={optionValue}
                          key={option.name + optionValue.value}
                        />
                      ),
                  )}
              </RadioGroup.Root>
            )}
          </VariantSelector>
        );
      })}
    </div>
  );
}
