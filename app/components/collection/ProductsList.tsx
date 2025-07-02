import {Fragment} from 'react';
import type {Pagination} from '@shopify/hydrogen';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {PaginatedResourceSection} from '../common/PaginatedResourceSection';
import {ProductCard} from '../product/ProductCard';
import {Insert} from './Insert';
import type {InsertQueryResult} from 'sanity.generated';
import type {ProductItemFragment} from 'storefrontapi.generated';
import styles from './ProductsList.module.css';

export function ProductsList({
  connection,
  insert,
}: {
  connection: React.ComponentProps<
    typeof Pagination<ProductItemFragment>
  >['connection'];
  insert?: Promise<{data: InsertQueryResult}>;
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  if (!connection) {
    return null;
  }

  return (
    <div className={styles.root}>
      <PaginatedResourceSection
        className={styles.list}
        connection={connection}
        tag="ul"
      >
        {({node, index}) => (
          <Fragment key={node.id}>
            {insert && index === (isDesktop ? 6 : 4) && (
              <li>
                <Insert className={styles.insert} insert={insert} />
              </li>
            )}
            <li>
              <ProductCard
                handle={node.handle}
                initialData={node}
                priority={index < 4}
              />
            </li>
          </Fragment>
        )}
      </PaginatedResourceSection>
    </div>
  );
}
