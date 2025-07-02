import {useState, use, createContext} from 'react';
import {useProductView} from '../ProductView';
import {ProductViewDrawerContent} from './ProductViewDrawerContent';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import type {ProductFragment} from 'storefrontapi.generated';
import {useProducts} from '~/hooks/useProducts';
import {Drawer, DrawerTrigger} from '../../ui/Drawer';

type Filters = {
  finishes: string[];
  hasProtector: boolean | null;
};

export function ProductViewDrawer({
  enabled = true,
  layout = 'page',
  children,
}: {
  enabled?: boolean;
  layout?: 'page' | 'card';
  children: React.ReactElement<typeof DrawerTrigger>;
}) {
  const {product: initialProduct, selectedOptions: initialSelectedOptions} =
    useProductView();
  const [isProductViewDrawerOpen, setIsProductViewDrawerOpen] =
    useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const [selectedProduct, setSelectedProduct] = useState<ProductFragment>();
  const [selectedProducts, setSelectedProducts] = useState<ProductFragment[]>(
    [],
  );
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  const associatedProducts =
    initialProduct?.associatedProducts?.references?.nodes?.map(
      (associatedProduct) => {
        const {handle} = associatedProduct ?? {};

        return {
          handle,
          selectedOptions:
            handle === selectedProduct?.handle ? selectedOptions : null,
        };
      },
    ) ?? [];

  const {data: products} = useProducts(associatedProducts);

  const [filters, setFilters] = useState<Filters>({
    finishes: [],
    hasProtector: null,
  });

  const handleOpenChange = (open: boolean) => {
    setIsProductViewDrawerOpen(open);
    setSelectedProducts([initialProduct!]);
    setSelectedProduct(initialProduct!);
    setSelectedOptions(initialSelectedOptions);
  };

  return (
    <ProductViewDrawerContext
      value={{
        isProductViewDrawerOpen,
        setIsProductViewDrawerOpen,
        layout,
        searchValue,
        setSearchValue,
        products,
        selectedProducts,
        setSelectedProducts,
        selectedProduct,
        setSelectedProduct,
        selectedOptions,
        setSelectedOptions,
        filters,
        setFilters,
      }}
    >
      <Drawer open={isProductViewDrawerOpen} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        {enabled && <ProductViewDrawerContent />}
      </Drawer>
    </ProductViewDrawerContext>
  );
}

export function useProductViewDrawer() {
  return use(ProductViewDrawerContext);
}

const ProductViewDrawerContext = createContext<{
  isProductViewDrawerOpen: boolean;
  setIsProductViewDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  layout: 'page' | 'card';
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  products: ProductFragment[];
  selectedProducts: ProductFragment[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductFragment[]>>;
  selectedProduct: ProductFragment | undefined;
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<ProductFragment | undefined>
  >;
  selectedOptions: SelectedOption[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOption[]>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}>({
  isProductViewDrawerOpen: false,
  setIsProductViewDrawerOpen: () => {},
  layout: 'page',
  searchValue: 'string',
  setSearchValue: () => {},
  products: [],
  selectedProducts: [],
  setSelectedProducts: () => [],
  selectedProduct: undefined,
  setSelectedProduct: () => {},
  selectedOptions: [],
  setSelectedOptions: () => [],
  filters: {
    finishes: [],
    hasProtector: null,
  },
  setFilters: () => {},
});
