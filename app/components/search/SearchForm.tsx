import type {loader} from '~/routes/_store.($locale).search';
import {FormControl, FormField, FormSubmit} from '@radix-ui/react-form';
import { Form as RemixForm, useLocation, useLoaderData } from 'react-router';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {SearchResults} from './SearchResults';
import {Form} from '../ui/Form';
import {useIntl, FormattedMessage} from 'react-intl';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import styles from './SearchForm.module.css';

export function SearchForm({collapsible}: {collapsible?: boolean}) {
  const {formatMessage} = useIntl();
  const pathWithLocale = usePathWithLocale(`/search`);
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {search} = useLocation();
  const searchParams = new URLSearchParams(search);
  const q = searchParams.get('q') as string;
  const data = useLoaderData<typeof loader>();
  const {totalCount: total} = data?.result.items.products ?? {};

  const ref: React.RefCallback<HTMLInputElement> = (node) => {
    if (collapsible && node) {
      node.focus({preventScroll: true});
    }
  };

  return (
    <div className={styles.root}>
      <Form
        className={styles.form}
        action={pathWithLocale}
        role="search"
        asChild
      >
        <RemixForm viewTransition>
          <div className={styles['form-container']}>
            <FormField name="q">
              <Heading size={isDesktop ? 'xl' : 'lg'} asChild>
                <FormControl
                  className={styles.control}
                  type="search"
                  placeholder={`${formatMessage({
                    id: 'search',
                  })}...`}
                  aria-label={formatMessage({
                    id: 'search',
                  })}
                  autoCorrect="off"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  defaultValue={q}
                  ref={ref}
                />
              </Heading>
            </FormField>
            <FormSubmit
              className={styles.submit}
              aria-label={formatMessage({
                id: 'validate',
              })}
            />
          </div>
          {!collapsible && (
            <Text
              role="status"
              size="xs"
              color="medium"
              className={styles.results}
            >
              {total > 0 ? (
                <FormattedMessage
                  id="results_search"
                  values={{
                    count: total,
                  }}
                />
              ) : (
                <SearchResults.Empty />
              )}
            </Text>
          )}
        </RemixForm>
      </Form>
    </div>
  );
}
