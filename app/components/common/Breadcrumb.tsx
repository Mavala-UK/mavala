import { useRouteLoaderData } from 'react-router';
import type {RootLoader} from '~/root';
import {useIntl, FormattedMessage} from 'react-intl';
import {Link} from './Link';
import {Text} from '../ui/Text';
import styles from './Breadcrumb.module.css';

export function Breadcrumb({
  items,
}: {
  items: {title: string | undefined; pathname?: string}[];
}) {
  const {formatMessage} = useIntl();
  const data = useRouteLoaderData<RootLoader>('root');
  const {pathPrefix} = data?.selectedLocale ?? {};

  return (
    <nav
      className={styles.root}
      aria-label={formatMessage({
        id: 'breadcrumb',
      })}
    >
      <ol className={styles.list}>
        <li className={styles.item}>
          <Text asChild size="xs" weight="light">
            <Link
              to={`${pathPrefix === '' ? '/' : pathPrefix}`}
              className={styles.link}
            >
              <FormattedMessage id="homepage" />
            </Link>
          </Text>
        </li>
        {items.map((item, index) => {
          const currentCategory = index === items.length - 1;
          const {title, pathname} = item ?? {};

          return (
            <li className={styles.item} key={item.title}>
              <Text
                asChild
                size="xs"
                weight="light"
                {...(currentCategory && {
                  color: 'medium',
                })}
              >
                {!currentCategory ? (
                  <Link to={pathname!} className={styles.link}>
                    {title}
                  </Link>
                ) : (
                  <span>{title}</span>
                )}
              </Text>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
