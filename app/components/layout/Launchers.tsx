import {cn} from '~/lib/utils';
import {Button} from '../ui/Button';
import type {
  LauncherItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {ProductCard} from '../product/ProductCard';
import {CollectionCard} from '../collection/CollectionCard';
import styles from './Launchers.module.css';

export function Launchers({
  items,
  title,
  className,
}: {
  items: CollectionItemFragment[] | LauncherItemFragment[];
  title?: string;
  className?: string;
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  return (
    items && (
      <div className={cn(styles.root, className)}>
        {title && (
          <Button asChild variant="unstyled" color="light" size="sm">
            <p>{title}</p>
          </Button>
        )}
        <div className={styles.launchers}>
          {items?.map((item) => {
            const {type, collection, product} = item as LauncherItemFragment;

            switch (type) {
              case 'launcher':
                return (
                  <CollectionCard
                    key={item.id}
                    {...(!isDesktop && {variant: 'compact'})}
                    handle={collection?.reference?.handle!}
                    initialData={collection?.reference!}
                    size="sm"
                    sizes="(min-width: 120rem) 22.188rem, (min-width: 64rem) 13vw, 3.5rem"
                  />
                );
              case 'launcher_product':
                return (
                  <ProductCard
                    key={item.id}
                    handle={product?.reference?.handle!}
                    initialData={product?.reference!}
                    showAddButton={false}
                    {...(!isDesktop && {variant: 'compact'})}
                  />
                );
              default:
                return (
                  <CollectionCard
                    key={item.id}
                    {...(!isDesktop && {variant: 'compact'})}
                    handle={item?.handle}
                    initialData={item as CollectionItemFragment}
                    size={isDesktop ? 'lg' : 'sm'}
                    sizes="(min-width: 80rem) 28.125rem, (min-width: 64rem) 31.25rem, 3.5rem"
                  />
                );
            }
          })}
        </div>
      </div>
    )
  );
}
