import type {
  MoneyV2,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import type {MainColorFragment} from 'storefrontapi.generated';
import { useRouteLoaderData } from 'react-router';
import {RootLoader} from '~/root';

export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatMoney(money: Partial<MoneyV2> | null | undefined) {
  const data = useRouteLoaderData<RootLoader>('root');
  const {language} = data?.selectedLocale ?? {};

  return new Intl.NumberFormat(language?.toLowerCase(), {
    style: 'currency',
    currency: money?.currencyCode ?? 'EUR',
  }).format(Number(money?.amount ?? 0));
}

export function removeZeroWidthSpace(str: string) {
  return str.replace(/[\u200B-\u200D\uFEFF]/g, '');
}

export function truncate(str: string, num = 120): string {
  if (typeof str !== 'string') return '';
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num - 3) + '…';
}

export function toTitleCase(string: string) {
  return string.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
  );
}

export function startViewTransition(callback: () => void) {
  if ('startViewTransition' in document) {
    document.startViewTransition(callback);
    return;
  }

  callback();
}

export const sortColorsByName = (colors: MainColorFragment[]) => {
  const getColorName = (product: MainColorFragment) =>
    product?.mainColor?.reference?.name?.value ?? '';

  return colors
    ?.slice()
    ?.sort((a, b) => getColorName(a).localeCompare(getColorName(b)));
};

export function slugify(str: string): string {
  return str
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

export function getVariantSearchString(selectedOptions: SelectedOption[]) {
  const searchParams = new URLSearchParams(
    selectedOptions?.length === 0
      ? []
      : selectedOptions?.map((option) => [option.name, option.value]),
  );

  return searchParams.size ? `?${searchParams.toString()}` : '';
}

/* variants */
export function getVariantUrl({
  handle,
  searchParams,
  selectedOptions,
  pathPrefix,
}: {
  handle: string;
  searchParams: URLSearchParams;
  selectedOptions: SelectedOption[];
  pathPrefix: string;
}) {
  selectedOptions?.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  return `${pathPrefix}/products/${handle}${searchParams.toString() ? `?${searchParams}` : ''}`;
}
