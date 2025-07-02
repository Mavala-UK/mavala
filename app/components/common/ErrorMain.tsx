import {useId, use} from 'react';
import { isRouteErrorResponse, useRouteError, useRouteLoaderData } from 'react-router';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import type {RootLoader} from '~/root';
import {FeaturedCollections} from '../collection/FeaturedCollections';
import {FormattedMessage} from 'react-intl';
import {Heading} from '../ui/Heading';
import {Link} from '../ui/Link';
import {Text} from '../ui/Text';
import styles from './ErrorMain.module.css';

export function ErrorMain() {
  const id = useId();
  const error = useRouteError();
  const data = useRouteLoaderData<RootLoader>('root');
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {
    featuredCollectionsError: featuredCollectionsErrorPromise,
    selectedLocale,
  } = data ?? {};
  const featuredCollectionsError = use(featuredCollectionsErrorPromise!);
  const {pathPrefix} = selectedLocale ?? {};

  if (!isRouteErrorResponse(error)) {
    console.error(error);
  }

  return (
    <>
      <div className={styles.root}>
        <Heading size={isDesktop ? '3xl' : 'xl'} asChild>
          <h1>
            {isRouteErrorResponse(error) ? (
              error.status === 404 ? (
                <FormattedMessage id="page_not_found" />
              ) : (
                <FormattedMessage id="internal_server_error" />
              )
            ) : (
              <FormattedMessage id="application_error" />
            )}
          </h1>
        </Heading>
        {process.env.NODE_ENV === 'development' &&
          ((isRouteErrorResponse(error) && error.data) ||
            error instanceof Error) && (
            <pre className={styles.message}>
              {isRouteErrorResponse(error) ? error.data : error.stack}
            </pre>
          )}
        <Text weight="light" size={isDesktop ? 'lg' : 'md'}>
          <FormattedMessage
            id="error_label"
            values={{
              linkHome: (
                <Link
                  key={id}
                  to={`${pathPrefix}`}
                  variant="animated-underline-reverse"
                  size="sm"
                >
                  <FormattedMessage id="link_home" />
                </Link>
              ),
            }}
          />
        </Text>
      </div>
      <div className={styles.collections}>
        <FeaturedCollections
          data={featuredCollectionsError?.data?.featuredCollections!}
          noTitle
        />
      </div>
    </>
  );
}
