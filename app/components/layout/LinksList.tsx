import { useRouteLoaderData } from 'react-router';
import {Button} from '../ui/Button';
import {Heading} from '../ui/Heading';
import type {
  MenuItemFragment,
  CollectionMenuFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {cn} from '~/lib/utils';
import {useMenu} from '~/hooks/useMenu';
import type {RootLoader} from '~/root';
import {Link} from '../ui/Link';
import styles from './LinksList.module.css';

export function LinksList({
  items,
  title,
  size = 'md',
  currentCollection,
  variant = 'collection',
  className,
}: {
  items: CollectionItemFragment[] | MenuItemFragment[];
  title: string;
  size?: 'sm' | 'md';
  currentCollection?: CollectionMenuFragment;
  variant?: 'collection' | 'menu-item';
  className?: string;
}) {
  const data = useRouteLoaderData<RootLoader>('root');
  const {pathPrefix} = data?.selectedLocale ?? {};
  const {labelSeeAll} = data?.header.menu ?? {};
  const {buildItemUrl} = useMenu();

  return (
    items && (
      <div className={cn(styles.root, className)} data-size={size}>
        <Button
          color="light"
          asChild
          variant="unstyled"
          size="sm"
          className={styles.title}
        >
          <p>{title}</p>
        </Button>
        <nav role="navigation" aria-label={`Navigation ${title}`}>
          <ul className={styles.items}>
            {items?.map((item) => (
              <li key={item.id}>
                <Heading size={size}>
                  <Link
                    variant="animated-underline"
                    className={styles.link}
                    to={(() => {
                      switch (variant) {
                        case 'collection':
                          return `${pathPrefix}/collections/${
                            (item as CollectionItemFragment).handle
                          }`;
                        case 'menu-item':
                          return buildItemUrl(item as MenuItemFragment);
                      }
                    })()}
                  >
                    {item.title}
                  </Link>
                </Heading>
              </li>
            ))}
            {currentCollection && (
              <li>
                <Heading size={size}>
                  <Link
                    variant="animated-underline"
                    to={`${pathPrefix}/collections/${currentCollection.handle}`}
                    className={styles.link}
                  >
                    {labelSeeAll?.value}
                  </Link>
                </Heading>
              </li>
            )}
          </ul>
        </nav>
      </div>
    )
  );
}
