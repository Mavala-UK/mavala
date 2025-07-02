import type {UseQueryOptions} from '@tanstack/react-query';
import { useParams } from 'react-router';
import {useQuery} from '@tanstack/react-query';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export function useCollectionItem(
  handle: string | null,
  {first, priceMin = 0.1}: {first: number; priceMin?: number} = {
    first: 0,
    priceMin: 0.1,
  },
  options?: Omit<
    UseQueryOptions<CollectionItemFragment>,
    'queryKey' | 'queryFn'
  >,
) {
  const {locale} = useParams();
  const searchParams = new URLSearchParams({
    first: String(first),
    priceMin: String(priceMin),
  });

  return useQuery({
    queryKey: ['collectionItem', handle, {first, priceMin}],
    queryFn: async ({signal}) => {
      const response = await fetch(
        `${
          locale ? `/${locale}` : ''
        }/resource/collection-items/${handle}?${searchParams.toString()}`,
        {
          signal,
        },
      );

      return response.json<CollectionItemFragment>();
    },
    retry: false,
    enabled: !!handle,
    ...options,
  });
}
