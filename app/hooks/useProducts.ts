import type {QueryFunctionContext} from '@tanstack/react-query';
import {useQueries} from '@tanstack/react-query';
import type {ProductFragment} from 'storefrontapi.generated';
import {getVariantSearchString} from '~/lib/utils';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';

export function useProducts(
  handles: {
    handle: string;
    selectedOptions: SelectedOption[] | null;
  }[],
) {
  return useQueries({
    queries: handles.map(({handle, selectedOptions}) => ({
      queryKey: ['products', handle, selectedOptions],
      queryFn: async ({signal}: QueryFunctionContext) => {
        const search = selectedOptions
          ? getVariantSearchString(selectedOptions ?? [])
          : '';

        const response = await fetch(`/resource/product/${handle}${search}`, {
          signal,
        });
        return response.json<ProductFragment[]>();
      },
      retry: false,
    })),
    combine: (results) => ({
      data: results
        .flatMap((result) => result.data ?? [])
        .filter((product, index, self) => {
          return (
            index === self.findIndex(({handle}) => handle === product.handle)
          );
        }),
    }),
  });
}
