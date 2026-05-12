import {useEffect} from 'react';
import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteLoaderData,
  ScrollRestoration,
  type ShouldRevalidateFunction,
  useLocation,
} from 'react-router';
import {
  useNonce,
  getShopAnalytics,
  getSeoMeta,
  type SeoConfig,
} from '@shopify/hydrogen';
import groq from 'groq';
import {truncate} from './lib/utils';
import {GLOBAL_QUERY, SHOP_QUERY} from './lib/queries';
import {FOOTER_QUERY} from './lib/queries/footer';
import {HEADER_QUERY} from './lib/queries/header';
import {AUTOMATIC_DISCOUNTS_QUERY} from './graphql/admin/AutomaticDiscountsQuery';
import {articleFragment} from './sanity/fragments/articleFragment';
import {CUSTOMER_DETAILS_QUERY} from './graphql/customer-account/CustomerDetailsQuery';
import {collectionsFragment} from './sanity/fragments/collectionsFragment';
import type {
  TranslationsQueryResult,
  FeaturedCollectionErrorQueryResult,
  FeaturedArticlesQueryResult,
} from 'sanity.generated';
import storeStyles from '~/styles/store.css?url';
import studioStyles from '~/styles/studio.css?url';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  return defaultShouldRevalidate;
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return getSeoMeta(data?.seo) ?? [];
};

export function links() {
  return [
    {rel: 'icon', href: '/icons/favicon.svg', type: 'image/svg+xml'},
    {
      rel: 'manifest',
      href: '/manifest.json',
      crossOrigin: 'use-credentials',
    },
  ];
}

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  const {storefront, sanity, env, sites, locales} = args.context;
  const language = storefront.i18n?.language.toLowerCase();

  const translations = await sanity.loadQuery<TranslationsQueryResult>(
    translationsQuery,
    {language},
  );

  const featuredCollectionsError =
    sanity.loadQuery<FeaturedCollectionErrorQueryResult>(
      featuredCollectionErrorQuery,
      {
        language,
      },
    );

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    analytics: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    sanity: {
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET || 'production',
      preview: sanity.preview?.enabled,
      apiVersion: env.SANITY_API_VERSION,
    },
    env: {
      OMNISEND_BRAND_ID: env.OMNISEND_BRAND_ID,
    },
    locales,
    selectedLocale: storefront.i18n ?? locales.default,
    sites,
    translations,
    featuredCollectionsError: featuredCollectionsError,
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront, customerAccount} = context;

  const [{shop}, {global}, header, isLoggedIn] = await Promise.all([
    storefront.query(SHOP_QUERY, {
      cache: storefront.CacheShort(),
    }),
    storefront.query(GLOBAL_QUERY, {
      variables: {handle: {handle: 'global', type: 'global'}},
      cache: storefront.CacheShort(),
    }),
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        mainMenuHandle: 'main-menu',
        secondaryMenuHandle: 'secondary-menu',
        secondaryMenuMobileHandle: 'secondary-menu-mobile',
        menuHandle: {handle: 'menu', type: 'menu'},
        first: 1,
      },
    }),
    customerAccount.isLoggedIn(),
  ]);

  const customer = isLoggedIn
    ? (await customerAccount.query(CUSTOMER_DETAILS_QUERY)).data?.customer
    : null;

  const seo = {
    title: '404',
    titleTemplate: `%s | ${shop.name}`,
    description: truncate(
      shop?.brand?.shortDescription ?? shop.description ?? '',
    ),
    media: shop.brand?.coverImage?.image,
    robots: {
      noIndex: false,
      noFollow: false,
    },
    url: request.url,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: shop.name,
      logo: shop.brand?.logo?.image?.url,
      url: `${origin}`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${origin}/search?q={search_term}`,
        query: "required name='search_term'",
      },
    },
  } satisfies SeoConfig;

  return {shop, global, header, customer, seo};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {storefront, customerAccount, cart, sanity, admin, sites} = context;
  const language = storefront.i18n?.language.toLowerCase();

  const footer = storefront
    .query(FOOTER_QUERY, {
      variables: {
        handle: {handle: 'footer', type: 'footer'},
        footerMenuHandle: 'footer',
        legalMenuHandle: 'menu-legal',
      },
      cache: storefront.CacheLong(),
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  const featuredArticles = sanity.loadQuery<FeaturedArticlesQueryResult>(
    featuredArticlesQuery,
    {
      language,
    },
  );

  const automaticDiscounts = sites?.isMavalaFrance
    ? admin.request(AUTOMATIC_DISCOUNTS_QUERY)
    : null;

  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
    featuredArticles,
    automaticDiscounts,
  };
}

export default function App() {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  const {pathname} = useLocation();
  const {selectedLocale, global, sites, sanity, env} = data ?? {};
  const {isMavalaFrance} = sites ?? {};
  const announcements = global?.announcements?.references?.nodes ?? [];
  const isStudio = pathname.includes('studio');
  const showPopupNewsletter =
    process.env.NODE_ENV !== 'development' && isMavalaFrance && !isStudio;

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    const w: Window = window;
    const d: Document = document;
    const s = 'script';
    const l = 'dataLayer';
    const i = 'GTM-WM26WWGT';

    w[l] = w[l] || [];
    w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});

    const f: HTMLScriptElement | null = d.getElementsByTagName(s)[0];
    const j: HTMLScriptElement = d.createElement(s) as HTMLScriptElement;
    const dl: string = l !== 'dataLayer' ? `&l=${l}` : '';

    j.async = true;
    j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
    f?.parentNode?.insertBefore(j, f);
  }, []);

  useEffect(() => {
    const handleUnload = () => {};
    window.addEventListener('unload', () => handleUnload);

    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  return (
    <html
      lang={selectedLocale?.language.toLowerCase()!}
      style={{
        ['--announcement-bar-height' as string]:
          announcements.length === 0 ? '0rem' : '4.8rem',
      }}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="google-site-verification" content="dtwalNzYOoDRGhmvccF1jIUxPm5oct6qpXHSDDnmjI0" />
        <link rel="stylesheet" href={isStudio ? studioStyles : storeStyles} />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.SITES = ${JSON.stringify(sites)};
              window.SANITY = ${JSON.stringify(sanity)};
              window.ENV = ${JSON.stringify(env)};
            `,
          }}
        />
        {showPopupNewsletter && (
          <script
            type="text/javascript"
            src="https://forms-akamai.smsbump.com/853926/form_362417.js"
          />
        )}
        {/* Omnisend Integration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.omnisend = window.omnisend || [];
              !function(){
                var e=document.createElement("script");
                e.type="text/javascript",e.async=!0,e.src="https://omnisnippet1.com/inshop/launcher-v2.js";
                var t=document.getElementsByTagName("script")[0];
                t.parentNode.insertBefore(e,t)
              }();
            `,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TFX9X589"
            height="0"
            width="0"
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
          ></iframe>
        </noscript>
        <Outlet />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

/* Sanity translations */
const translationsQuery = groq`
  *[_type == "translation"] {
    "id": id.current,
    "message": coalesce(
      message[_key == $language][0].value,
      message[0].value
    )
  }
`;

const featuredCollectionErrorQuery = groq`
  *[_type == "home"][0] {
    _type,
    _key,
    featuredCollections{
      ${collectionsFragment}
    },
  }
`;

const featuredArticlesQuery = groq`
  {
    "title": *[_type == "blog"][0]{
      "value": coalesce(
        title[_key == $language][0].value,
        title[0].value
      )
    }.value,
    "shortDescription": *[_type == "articleLauncher"][0]{
      "value": coalesce(
        shortDescription[_key == $language][0].value,
        shortDescription[0].value
      )
    }.value,
    "featuredArticles": *[_type == "articleLauncher"][0].featuredArticles[]-> {
      ${articleFragment}
    }
  }
`;
