import {createContext, use, useState} from 'react';
import type {ProductFragment, ProductVariantFragment} from 'storefrontapi.generated';

type BundleContextType = {
  bundleProduct: ProductFragment;
  selectedVariants: Record<string, ProductVariantFragment | null>;
  setSelectedVariant: (handle: string, variant: ProductVariantFragment | null) => void;
};

export const BundleContext = createContext<BundleContextType>({
  bundleProduct: null as unknown as ProductFragment,
  selectedVariants: {},
  setSelectedVariant: () => {},
});

export function useBundleContext() {
  return use(BundleContext);
}

export function BundleProvider({
  bundleProduct,
  children,
}: {
  bundleProduct: ProductFragment;
  children: React.ReactNode;
}) {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, ProductVariantFragment | null>
  >({});

  const setSelectedVariant = (
    handle: string,
    variant: ProductVariantFragment | null,
  ) => {
    setSelectedVariants((prev) => ({...prev, [handle]: variant}));
  };

  return (
    <BundleContext
      value={{bundleProduct, selectedVariants, setSelectedVariant}}
    >
      {children}
    </BundleContext>
  );
}
