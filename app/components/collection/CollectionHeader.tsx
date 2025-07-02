import {useMemo} from 'react';
import type {loader} from '~/routes/_store.($locale).collections.$handle';
import {useIntl} from 'react-intl';
import {cn} from '~/lib/utils';
import { useRouteLoaderData, useLoaderData } from 'react-router';
import type {RootLoader} from '~/root';
import {NavLinks, NavLink} from '../common/NavLinks';
import {PageIntro} from '../common/PageIntro';
import styles from './CollectionHeader.module.css';

export function CollectionHeader({showCategories}: {showCategories?: boolean}) {
  const data = useRouteLoaderData<RootLoader>('root');
  const {pathPrefix} = data?.selectedLocale ?? {};
  const {formatMessage} = useIntl();
  const {collection, collections} = useLoaderData<typeof loader>();
  const {title, description} = collection ?? {};
  const parentCollection = collection.parentCollection?.reference;
  const grandParentCollection = parentCollection?.parentCollection?.reference;

  const collectionHandle = (
    grandParentCollection
      ? parentCollection
      : parentCollection
        ? parentCollection
        : collection
  ).handle;

  const childCollections = useMemo(
    () =>
      collections
        ?.filter(
          (c) => c?.parentCollection?.reference?.handle === collectionHandle,
        )
        .sort((a, b) => {
          const orderA = a.order?.value ? Number(a.order.value) : Infinity;
          const orderB = b.order?.value ? Number(b.order.value) : Infinity;
          return orderA - orderB;
        }),
    [collection, collections, grandParentCollection, parentCollection],
  );

  return (
    <div
      className={cn(
        styles.root,
        !showCategories ? styles['no-categories'] : '',
      )}
    >
      <PageIntro
        title={title}
        description={description}
        className={styles.content}
      />
      {showCategories && childCollections.length > 0 && (
        <NavLinks
          aria-label={formatMessage({
            id: 'subcategories',
          })}
        >
          {[
            <NavLink
              key={'collection'}
              to={`${pathPrefix}/collections/${collectionHandle}`}
              title={formatMessage({
                id: 'see_all',
              })}
            />,
            ...childCollections.map((collection) => (
              <NavLink
                key={collection?.handle}
                to={`${pathPrefix}/collections/${(grandParentCollection ? parentCollection : collection)?.handle}`}
                title={collection?.title}
              />
            )),
          ].filter(Boolean)}
        </NavLinks>
      )}
    </div>
  );
}
