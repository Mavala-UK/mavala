import { useRouteLoaderData } from 'react-router';
import {Studio as SanityStudio} from 'sanity';
import config from '../../../sanity.config';
import type {RootLoader} from '~/root';

export function Studio() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {sanity} = data ?? {};

  return (
    <SanityStudio
      basePath="/studio"
      config={{...config, ...sanity}}
      unstable_globalStyles
    />
  );
}
