import { useRouteLoaderData } from 'react-router';
import type {RootLoader} from '~/root';

export function usePathWithLocale(path: string) {
  const data = useRouteLoaderData<RootLoader>('root');

  return `${data?.selectedLocale?.pathPrefix}${
    path?.startsWith('/') ? path : '/' + path
  }`.replace(/\/$/, '');
}
