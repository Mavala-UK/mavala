import { useRouteLoaderData } from 'react-router';
import {RootLoader} from '~/root';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';
import {getVariantUrl} from '~/lib/utils';

export function useVariantUrl(
  handle: string,
  selectedOptions: SelectedOption[],
) {
  const data = useRouteLoaderData<RootLoader>('root');
  const {pathPrefix} = data?.selectedLocale ?? {};

  const firstVariantIsDefault = Boolean(
    selectedOptions?.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  return useMemo(() => {
    return getVariantUrl({
      handle,
      searchParams: new URLSearchParams(),
      selectedOptions: firstVariantIsDefault ? [] : selectedOptions,
      pathPrefix: pathPrefix!,
    });
  }, [handle, firstVariantIsDefault, selectedOptions]);
}
