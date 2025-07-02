import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import type {UseQueryOptions} from '@tanstack/react-query';
import {useQuery, keepPreviousData} from '@tanstack/react-query';
import type {ProductFragment} from 'storefrontapi.generated';
import {getVariantSearchString} from '~/lib/utils';

export function useProduct(
  handle: string | null,
  selectedOptions: SelectedOption[],
  options?: Omit<UseQueryOptions<ProductFragment>, 'queryKey' | 'queryFn'>,
) {
  const search = getVariantSearchString(selectedOptions ?? []);

  return useQuery({
    queryKey: ['product', handle, selectedOptions],
    queryFn: async ({signal}) => {
      const response = await fetch(`/resource/product/${handle}${search}`, {
        signal,
      });

      return response.json<ProductFragment>();
    },
    placeholderData: keepPreviousData,
    retry: false,
    enabled: !!handle,
    ...options,
  });
}
