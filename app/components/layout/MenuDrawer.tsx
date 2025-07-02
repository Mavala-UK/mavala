import {useState, createContext, useContext, useEffect} from 'react';
import { useRouteLoaderData, useLocation } from 'react-router';
import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import type {
  CollectionMenuFragment,
  MenuItemFragment,
} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';
import {
  DrawerTitle,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
} from '../ui/Drawer';
import {useMenu} from '~/hooks/useMenu';
import {useIntl, FormattedMessage} from 'react-intl';
import {Newsletter} from './Newsletter';
import {Heading} from '../ui/Heading';
import {Launchers} from './Launchers';
import {LinksList} from './LinksList';
import {Link} from '../ui/Link';
import styles from './MenuDrawer.module.css';

type Panel = {
  type: 'menu' | 'products' | 'categories' | null;
  collection: CollectionMenuFragment | null;
};

const PanelContext = createContext<{
  panel: Panel;
  setPanel: React.Dispatch<React.SetStateAction<Panel>>;
} | null>(null);

const usePanel = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanel must be used within a PanelProvider');
  }
  return context;
};

export function MenuDrawer({
  setIsMenuOpen,
}: {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [panel, setPanel] = useState<Panel>({type: 'menu', collection: null});
  const {pathname, search} = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    setPanel(() => ({
      type: 'menu',
      collection: null,
    }));
  }, [pathname, search, setIsMenuOpen]);

  return (
    <PanelContext.Provider value={{panel, setPanel}}>
      <DrawerContent className={styles.root} animationOrigin="left">
        <DrawerHeader className={styles.header}>
          <div
            className={
              panel.type === 'menu'
                ? styles['header-content']
                : styles['header-content-back']
            }
          >
            <PanelHeaderSwitcher />
            <DrawerClose className={styles.close} />
          </div>
        </DrawerHeader>
        <DrawerBody className={styles.body}>
          <PanelSwitcher />
        </DrawerBody>
      </DrawerContent>
    </PanelContext.Provider>
  );
}

/* Panel header switcher */
function PanelHeaderSwitcher() {
  const {panel, setPanel} = usePanel();
  const data = useRouteLoaderData<RootLoader>('root');
  const {menu} = data?.header ?? {};
  const {collection} = panel ?? {};
  const {title} = collection ?? {};

  switch (panel?.type) {
    case 'menu':
    default:
      return (
        <VisuallyHidden asChild>
          <DrawerTitle>
            <FormattedMessage id="menu" />
          </DrawerTitle>
        </VisuallyHidden>
      );
    case 'products':
      return (
        <DrawerTitle asChild>
          <Heading asChild size="lg">
            <button
              type="button"
              className={styles['trigger-back']}
              onClick={() =>
                setPanel((prev) => ({
                  ...prev,
                  type: 'menu',
                }))
              }
            >
              {menu?.title?.value}
            </button>
          </Heading>
        </DrawerTitle>
      );
    case 'categories':
      return (
        <DrawerTitle asChild>
          <Heading asChild size="lg">
            <button
              type="button"
              className={styles['trigger-back']}
              onClick={() =>
                setPanel((prev) => ({
                  ...prev,
                  type: 'products',
                }))
              }
            >
              {title}
            </button>
          </Heading>
        </DrawerTitle>
      );
  }
}

function PanelSwitcher() {
  const {panel} = usePanel();

  switch (panel?.type) {
    case 'menu':
    default:
      return <MenuPanel />;
    case 'products':
      return <ProductsPanel />;
    case 'categories':
      return <CategoriesPanel />;
  }
}

/* Menu First Panel */
export function MenuPanel() {
  const {setPanel} = usePanel();
  const {buildItemUrl} = useMenu();
  const {formatMessage} = useIntl();
  const data = useRouteLoaderData<RootLoader>('root');
  const {header, sites} = data ?? {};
  const {isMavalaFrance} = sites ?? {};
  const {menu} = header ?? {};
  const {mainMenu, secondaryMenu, secondaryMenuMobile} = header ?? {};

  return (
    <>
      <nav
        role="navigation"
        className={styles['primary-nav']}
        aria-label={formatMessage({
          id: 'primary_nav',
        })}
      >
        <ul className={styles.items}>
          <li>
            <Heading asChild size="lg">
              <button
                type="button"
                className={styles.trigger}
                onClick={() => {
                  setPanel((prev) => ({
                    ...prev,
                    type: 'products',
                  }));
                }}
              >
                {menu?.title?.value}
              </button>
            </Heading>
          </li>
          {[...(mainMenu?.items || []), ...(secondaryMenu?.items || [])].map(
            (item: MenuItemFragment) => (
              <li key={item.id}>
                <Heading asChild size="lg">
                  <Link to={buildItemUrl(item)} className={styles.link}>
                    {item.title}
                  </Link>
                </Heading>
              </li>
            ),
          )}
        </ul>
      </nav>
      <nav
        role="navigation"
        className={styles['secondary-nav']}
        aria-label={formatMessage({
          id: 'secondary_nav',
        })}
      >
        <ul className={styles.items}>
          {secondaryMenuMobile?.items?.map((item: MenuItemFragment) => (
            <li key={item.id}>
              <Heading asChild>
                <Link to={buildItemUrl(item)} className={styles.link}>
                  {item.title}
                </Link>
              </Heading>
            </li>
          ))}
        </ul>
      </nav>
      {isMavalaFrance && <Newsletter variant="mini" />}
    </>
  );
}

/* Products Second Panel */
export function ProductsPanel() {
  const {setPanel} = usePanel();
  const {formatMessage} = useIntl();
  const data = useRouteLoaderData<RootLoader>('root');
  const {menu} = data?.header ?? {};
  const collections = menu?.categories?.references?.nodes;

  return (
    <>
      <nav
        role="navigation"
        className={styles['categories-nav']}
        aria-label={formatMessage({
          id: 'products_nav',
        })}
      >
        <ul className={styles.items}>
          {collections?.map((collection: CollectionMenuFragment) => {
            const {title, highlightCollection} = collection ?? {};

            return (
              <li key={collection.id}>
                <Heading asChild>
                  <button
                    type="button"
                    className={styles['trigger-categories']}
                    data-highlighted={Boolean(highlightCollection?.value)}
                    onClick={() =>
                      setPanel(() => ({
                        type: 'categories',
                        collection,
                      }))
                    }
                  >
                    {title}
                  </button>
                </Heading>
              </li>
            );
          })}
        </ul>
      </nav>
      <Launchers
        title={menu?.labelLaunchers?.value!}
        items={menu?.collectionsHighlight?.references?.nodes!}
      />
    </>
  );
}

/* Categories Third Panel */
export function CategoriesPanel() {
  const {panel} = usePanel();
  const data = useRouteLoaderData<RootLoader>('root');
  const {menu} = data?.header ?? {};
  const {collection: currentCollection} = panel ?? {};

  return (
    <div className={styles['categories-panel']}>
      <LinksList
        items={currentCollection?.relatedCollections?.references?.nodes!}
        title={menu?.labelCategories?.value!}
        currentCollection={currentCollection!}
      />
      <LinksList
        items={currentCollection?.concernsCollections?.references?.nodes!}
        title={menu?.labelConcerns?.value!}
      />
      <Launchers
        title={menu?.labelLaunchers?.value!}
        items={currentCollection?.highlightItems?.references?.nodes!}
        className={styles['categories-launchers']}
      />
    </div>
  );
}
