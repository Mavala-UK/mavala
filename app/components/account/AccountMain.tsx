import { Form, useLoaderData, Outlet } from 'react-router';
import type {loader} from '~/routes/_store.($locale).account';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {FormattedMessage, useIntl} from 'react-intl';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {Link} from '../ui/Link';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import {NavLinks, NavLink} from '../common/NavLinks';
import styles from './AccountMain.module.css';

export const ACCOUNT_ROUTES = {
  orders: 'order_history',
  profile: 'personal_information',
  addresses: 'my_addresses',
} as const;

export function AccountMain() {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {formatMessage} = useIntl();
  const {customer} = useLoaderData<typeof loader>();
  const pathWithLocale = usePathWithLocale(`/account`);

  return (
    <>
      <header className={styles.header}>
        <Form method="POST" action="/account/logout" viewTransition>
          <Text size="sm" weight="light" asChild>
            <Link variant="underline" asChild>
              <button type="submit">
                <FormattedMessage id="logout" />
              </button>
            </Link>
          </Text>
        </Form>
        <Heading size={isDesktop ? '3xl' : 'xl'} asChild>
          <h1>
            <FormattedMessage id="my_account" />
          </h1>
        </Heading>
      </header>
      <div className={styles.nav}>
        <NavLinks>
          {Object.entries(ACCOUNT_ROUTES).map(([slug, id]) => (
            <NavLink
              key={slug}
              title={formatMessage({
                id,
              })}
              to={`${pathWithLocale}/${slug}`}
            />
          ))}
        </NavLinks>
      </div>
      <section className={styles.content}>
        <Outlet context={{customer}} />
      </section>
    </>
  );
}
