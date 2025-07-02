import {useEffect, useState} from 'react';
import { useRouteLoaderData } from 'react-router';
import type {RootLoader} from '~/root';
import {useMenu} from '~/hooks/useMenu';
import {useIntl} from 'react-intl';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Button} from '../ui/Button';
import {Logo} from '../icons/Logo';
import {Menu} from '../icons/Menu';
import {SearchCollapsible} from '../search/SearchCollapsible';
import {Link} from '../ui/Link';
import {MainNav} from './MainNav';
import {Drawer, DrawerTrigger} from '../ui/Drawer';
import {MenuDrawer} from './MenuDrawer';
import {CartDrawerButton} from '../cart/CartDrawerButton';
import {Account} from '../icons/Account';
import styles from './HeaderMain.module.css';

export function HeaderMain({scrolled}: {scrolled: boolean}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shouldDelayTransitions, setShouldDelayTransitions] = useState(false);
  const {formatMessage} = useIntl();
  const {buildItemUrl} = useMenu();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const data = useRouteLoaderData<RootLoader>('root');
  const {header, selectedLocale, sites, isLoggedIn} = data ?? {};
  const {isMavalaFrance} = sites ?? {};
  const {mainMenu, secondaryMenu} = header ?? {};
  const {pathPrefix} = selectedLocale ?? {};

  useEffect(() => {
    if (scrolled) {
      return;
    }

    const transitionDurationValue = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--header-transition-duration');
    const timeoutDelay = parseFloat(transitionDurationValue) * 1000;

    setShouldDelayTransitions(true);
    setTimeout(() => setShouldDelayTransitions(false), timeoutDelay);
  }, [scrolled]);

  return (
    <div className={styles.root} data-transition-delay={shouldDelayTransitions}>
      <div className={styles.left}>
        <Drawer
          open={isMenuOpen}
          onOpenChange={(open: boolean) => setIsMenuOpen(open)}
        >
          <DrawerTrigger
            title={formatMessage({
              id: 'menu',
            })}
            className={styles.menu}
          >
            <Menu />
          </DrawerTrigger>
          {!isDesktop && <MenuDrawer setIsMenuOpen={setIsMenuOpen} />}
        </Drawer>
        <SearchCollapsible className={styles['search-mobile']} />
        <nav
          role="navigation"
          className={styles.nav}
          aria-label={formatMessage({
            id: 'fast_access',
          })}
        >
          <ul className={styles.items}>
            <li>
              <MainNav />
            </li>
            {mainMenu?.items?.map((item) => (
              <li key={item.id}>
                <Button asChild variant="unstyled">
                  <Link to={buildItemUrl(item)}>{item.title}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Link to={`${pathPrefix}`} className={styles.logo}>
        <Logo />
      </Link>
      <div className={styles.right}>
        <ul className={styles.items}>
          {secondaryMenu?.items?.map((item) => (
            <li key={item.id}>
              <Button asChild variant="unstyled">
                <Link to={buildItemUrl(item)}>{item.title}</Link>
              </Button>
            </li>
          ))}
        </ul>
        <div className={styles.tools}>
          <SearchCollapsible className={styles['search-desktop']} />
          {isMavalaFrance && (
            <>
              <Link
                to={`${pathPrefix}/account`}
                title={
                  isLoggedIn
                    ? formatMessage({
                        id: 'my_account',
                      })
                    : formatMessage({
                        id: 'connect',
                      })
                }
              >
                <Account />
              </Link>
              <CartDrawerButton />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
