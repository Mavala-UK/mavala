import {useEffect, useRef} from 'react';
import { useRouteLoaderData, useFetcher } from 'react-router';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {useIntl, FormattedMessage} from 'react-intl';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import {Form, FormField} from '../ui/Form';
import {type RootLoader} from '~/root';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {type action} from '~/routes/_store.($locale).subscribe';
import styles from './Newsletter.module.css';

export function Newsletter({variant}: {variant?: 'mini'}) {
  const fetcher = useFetcher<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const {formatMessage} = useIntl();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const data = useRouteLoaderData<RootLoader>('root');
  const {reference} = data?.global?.newsletter ?? {};
  const {title, subtitle} = reference ?? {};
  const actionWithLocale = usePathWithLocale('/subscribe');

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (fetcher.state === 'submitting') {
      event.preventDefault();
    }
  };

  useEffect(() => {
    formRef.current?.reset();
  }, [fetcher.data]);

  return (
    <div className={styles.root} data-variant={variant} id="newsletter">
      <div className={styles.titles}>
        {variant !== 'mini' ? (
          <>
            <Heading size={isDesktop ? 'xl' : 'lg'} asChild>
              <p>{title?.value}</p>
            </Heading>
            <Heading size={isDesktop ? 'xl' : 'lg'} asChild>
              <p>{subtitle?.value}</p>
            </Heading>
          </>
        ) : (
          <>
            <Text size="sm">{title?.value}</Text>
            <Text size="sm" color="medium">
              {subtitle?.value}
            </Text>
          </>
        )}
      </div>
      <Form
        asChild
        className={styles.form}
        action={actionWithLocale}
        method="POST"
        ref={formRef}
      >
        <fetcher.Form>
          <FormField
            type="email"
            name="email"
            autoComplete="email"
            variant="newsletter"
            required
            label={formatMessage({
              id: 'your_email',
            })}
            messages={{
              typeMismatch: formatMessage({
                id: 'message_invalid_email',
              }),
            }}
          />
          <button
            aria-label={title?.value!}
            type="submit"
            aria-busy={fetcher.state !== 'idle'}
            aria-disabled={fetcher.state !== 'idle'}
            onClick={handleClick}
          />
        </fetcher.Form>
      </Form>
      <Text
        role="status"
        size="xs"
        color={fetcher.data?.error ? 'accent' : 'medium'}
      >
        {fetcher.state === 'idle' &&
          fetcher.data &&
          (fetcher.data.error ?? <FormattedMessage id="newsletter_success" />)}
      </Text>
    </div>
  );
}
