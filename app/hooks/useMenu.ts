import { useRouteLoaderData } from 'react-router';
import type {MenuItemFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

export function useMenu() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {shop, publicStoreDomain} = data ?? {};
  const primaryDomain = shop?.primaryDomain.url;

  const buildItemUrl = (item: MenuItemFragment) => {
    if (!item.url) {
      return '#';
    }

    if (
      item.url.includes('myshopify.com') ||
      item.url.includes(publicStoreDomain ?? '') ||
      item.url.includes(primaryDomain ?? '')
    ) {
      return new URL(item.url).pathname;
    }

    return item.url;
  };

  return {buildItemUrl};
}
