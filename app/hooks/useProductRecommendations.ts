import { useParams } from 'react-router';
import type {QueryFunctionContext} from '@tanstack/react-query';
import {useQueries, keepPreviousData} from '@tanstack/react-query';
import type {ProductItemFragment} from 'storefrontapi.generated';

export function useProductRecommendations(productHandles: string[]) {
  const {locale} = useParams();

  return useQueries({
    queries: productHandles.map((productHandle) => ({
      queryKey: ['productRecommendations', productHandle],
      queryFn: async ({signal}: QueryFunctionContext) => {
        const response = await fetch(
          `${
            locale ? `/${locale}` : ''
          }/resource/product-recommendations/${productHandle}`,
          {signal},
        );
        return response.json<ProductItemFragment[]>();
      },
      retry: false,
      enabled: !!productHandle,
    })),
    combine: (results) => ({
      data: results
        .flatMap((result) => result.data ?? [])
        .filter(
          (product, index, self) =>
            index === self.findIndex(({handle}) => handle === product.handle),
        ),
    }),
  });
}
