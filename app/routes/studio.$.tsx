import type {MetaFunction} from 'react-router';
import {Suspense, lazy} from 'react';
import {useIsHydrated} from '~/hooks/useIsHydrated';

const Studio = lazy(() =>
  import('~/components/studio/Studio.client').then((mod) => ({
    default: mod.Studio,
  })),
);

export const meta: MetaFunction = () => [
  {title: 'Sanity Studio'},
  {name: 'referrer', content: 'same-origin'},
  {name: 'robots', content: 'noindex'},
];

export default function StudioPage() {
  const isHydrated = useIsHydrated();

  if (!isHydrated) {
    return null;
  }

  return (
    <Suspense>
      <Studio />
    </Suspense>
  );
}
