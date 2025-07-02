import {useState, use} from 'react';
import {useRouteLoaderData, useRouteError, useLocation} from 'react-router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {VisualEditing} from 'hydrogen-sanity/visual-editing';
import type {RootLoader} from '~/root';
import {Analytics} from '@shopify/hydrogen';
import {Footer} from '~/components/layout/Footer';
import {Header} from '~/components/layout/Header';
import {IntlProvider} from 'react-intl';
import {removeZeroWidthSpace} from '~/lib/utils';
import {CartDrawerProvider} from '../cart/CartDrawer';
import {Reassurances} from './Reassurances';
import {Ctas} from './Ctas';
import {GoogleTagManager} from '~/lib/gtm';
import {AxeptioConsent} from '~/lib/axeptio';

export function PageLayout({children}: {children?: React.ReactNode}) {
  const data = useRouteLoaderData<RootLoader>('root');
  const {
    selectedLocale,
    translations,
    locales,
    sites,
    cart,
    consent,
    analytics,
  } = data ?? {};
  const {isMavalaFrance} = sites ?? {};

  const messages = translations?.data.reduce<Record<string, string>>(
    (messages, {id, message}) => ({
      ...messages,
      [removeZeroWidthSpace(id ?? '')]: removeZeroWidthSpace(message ?? ''),
    }),
    {},
  );

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      }),
  );

  if (!data) {
    return children;
  }

  return (
    <Analytics.Provider cart={cart!} shop={analytics!} consent={consent!}>
      <IntlProvider
        locale={selectedLocale?.language.toLowerCase()!}
        defaultLocale={locales?.default.language.toLowerCase()}
        messages={messages}
        onError={() => {}}
      >
        <QueryClientProvider client={queryClient}>
          {isMavalaFrance ? (
            <CartDrawerProvider>
              <Layout>{children}</Layout>
            </CartDrawerProvider>
          ) : (
            <Layout>{children}</Layout>
          )}
        </QueryClientProvider>
      </IntlProvider>
      <GoogleTagManager />
      <AxeptioConsent />
    </Analytics.Provider>
  );
}

function Layout({children}: {children?: React.ReactNode}) {
  const {pathname} = useLocation();
  const data = useRouteLoaderData<RootLoader>('root');
  const {footer: footerPromise, sites, sanity} = data ?? {};
  const {isMavalaFrance} = sites ?? {};
  const {preview} = sanity ?? {};
  const footer = use(footerPromise!);
  const isError = Boolean(useRouteError());
  const showCtas =
    isMavalaFrance &&
    !isError &&
    !['account', 'contact', 'store-locator', 'faq'].some((path) =>
      pathname.includes(path),
    );

  return (
    <>
      <Header />
      <main>{children}</main>
      {showCtas && <Ctas />}
      <Reassurances />
      <Footer footer={footer!} />
      {preview && <VisualEditing />}
    </>
  );
}
