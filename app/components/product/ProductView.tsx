import {createContext, useState, use} from 'react';
import {useOptimisticVariant} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {useProduct} from '~/hooks/useProduct';

export type ProductViewType = 'page' | 'drawer';

export function ProductView({
  handle,
  selectedOptions: initialSelectedOptions,
  children,
}: {
  handle: string | null;
  selectedOptions: SelectedOption[];
  children: React.ReactNode;
}) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(
    initialSelectedOptions,
  );

  const {data: product} = useProduct(handle, selectedOptions);

  const selectedVariant = useOptimisticVariant(
    product?.selectedVariant,
    product?.variants,
  );

  if (!product) {
    return null;
  }

  return (
    <ProductViewContext
      value={{
        product,
        selectedVariant,
        selectedOptions,
        setSelectedOptions,
      }}
    >
      {children}
    </ProductViewContext>
  );
}

export function useProductView() {
  return use(ProductViewContext);
}

export const ProductViewContext = createContext<{
  product: ProductFragment | null;
  selectedVariant: ProductVariantFragment | null;
  selectedOptions: SelectedOption[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOption[]>>;
}>({
  product: null,
  selectedVariant: null,
  selectedOptions: [],
  setSelectedOptions: () => [],
});
