import {lazy, Suspense} from 'react';
import { useLoaderData } from 'react-router';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {type loader} from '~/routes/_store.($locale).store-locator';
import {PageIntro} from '../common/PageIntro';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {StoreLocatorList} from './StoreLocatorList';
import styles from './StoreLocatorMain.module.css';

const StoreLocator = lazy(() =>
  import('./StoreLocator').then((mod) => ({
    default: mod.StoreLocator,
  })),
);

export default function StoreLocatorMain() {
  const isHydrated = useIsHydrated();
  const {storesPage} = useLoaderData<typeof loader>();
  const {title, description} = storesPage ?? {};

  return (
    <>
      <PageIntro
        className={styles.intro}
        title={title?.value!}
        description={description?.value!}
      />
      <Suspense fallback={<StoreLocatorSkeleton />}>
        {isHydrated ? <StoreLocator /> : <StoreLocatorSkeleton />}
      </Suspense>
    </>
  );
}

function StoreLocatorSkeleton() {
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  return (
    <div className={styles.root}>
      <div className={styles['map-container']} />
      {isDesktop && <StoreLocatorList />}
    </div>
  );
}
