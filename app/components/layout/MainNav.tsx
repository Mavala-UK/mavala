import {useRef, useState} from 'react';
import type {Trigger, Content} from '@radix-ui/react-collapsible';
import { useRouteLoaderData } from 'react-router';
import type {CollectionMenuFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';
import {useIntl} from 'react-intl';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/Collapsible';
import {Button} from '../ui/Button';
import {Heading} from '../ui/Heading';
import {Launchers} from './Launchers';
import {LinksList} from './LinksList';
import styles from './MainNav.module.css';

export function MainNav() {
  const [currentCollection, setCurrentCollection] =
    useState<CollectionMenuFragment | null>();
  const [hoveredCollection, setHoveredCollection] =
    useState<CollectionMenuFragment | null>();
  const {formatMessage} = useIntl();
  const mainNavTriggerRef = useRef<React.ComponentRef<typeof Trigger>>(null);
  const mainNavContentRef = useRef<React.ComponentRef<typeof Content>>(null);
  const data = useRouteLoaderData<RootLoader>('root');
  const {menu} = data?.header ?? {};
  const collections = menu?.categories?.references?.nodes;

  return (
    <Collapsible
      className={styles.root}
      triggerRef={mainNavTriggerRef}
      contentRef={mainNavContentRef}
      onSectionChange={() => setCurrentCollection(null)}
    >
      <Button asChild variant="unstyled">
        <CollapsibleTrigger className={styles.trigger} ref={mainNavTriggerRef}>
          {menu?.title?.value}
        </CollapsibleTrigger>
      </Button>
      <CollapsibleContent ref={mainNavContentRef}>
        <div className={styles.content}>
          <nav
            role="navigation"
            className={styles['primary-nav']}
            aria-label={formatMessage({
              id: 'products_nav',
            })}
          >
            <ul>
              {collections?.map((collection: CollectionMenuFragment) => {
                const {title, highlightCollection} = collection ?? {};
                const isActive =
                  hoveredCollection?.id === collection.id ||
                  currentCollection?.id === collection.id ||
                  (!hoveredCollection && !currentCollection);

                return (
                  <li key={collection.id}>
                    <Heading asChild size="xl">
                      <button
                        type="button"
                        className={styles['category-button']}
                        data-highlighted={Boolean(highlightCollection?.value)}
                        onClick={() => setCurrentCollection(collection)}
                        onMouseEnter={() => setHoveredCollection(collection)}
                        onMouseLeave={() => setHoveredCollection(null)}
                        data-active={isActive}
                      >
                        {title}
                      </button>
                    </Heading>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className={styles['right-content']}>
            {!currentCollection ? (
              <Launchers
                items={menu?.collectionsHighlight?.references?.nodes!}
              />
            ) : (
              <div className={styles.menus}>
                <LinksList
                  items={
                    currentCollection?.relatedCollections?.references?.nodes!
                  }
                  title={menu?.labelCategories?.value!}
                  currentCollection={currentCollection}
                  size="sm"
                />
                <LinksList
                  items={
                    currentCollection?.concernsCollections?.references?.nodes!
                  }
                  size="sm"
                  title={menu?.labelConcerns?.value!}
                />
                <Launchers
                  className={styles.launcher}
                  title={menu?.labelLaunchers?.value!}
                  items={currentCollection?.highlightItems?.references?.nodes!}
                />
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
