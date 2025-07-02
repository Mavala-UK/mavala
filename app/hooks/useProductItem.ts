import { useParams } from 'react-router';
import type {UseQueryOptions} from '@tanstack/react-query';
import {useQuery} from '@tanstack/react-query';
import type {ProductItemFragment} from 'storefrontapi.generated';

export function useProductItem(
  handle: string | null,
  options?: Omit<UseQueryOptions<ProductItemFragment>, 'queryKey' | 'queryFn'>,
) {
  const {locale} = useParams();

  return useQuery({
    queryKey: ['productItem', handle],
    queryFn: async ({signal}) => {
      const response = await fetch(
        `${locale ? `/${locale}` : ''}/resource/product-item/${handle}`,
        {
          signal,
        },
      );
      return response.json<ProductItemFragment>();
    },
    retry: false,
    enabled: !!handle,
    ...options,
  });
}
