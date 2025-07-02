import {createAdminApiClient} from '@shopify/admin-api-client';
import {createStorefrontApiClient} from '@shopify/storefront-api-client';
import {createSanityContext} from 'hydrogen-sanity';
import {CART_QUERY_FRAGMENT} from './fragments/CartQueryFragment';
import {AppSession} from '~/lib/session';
import {SANITY_API_VERSION} from '~/sanity/constants';
import {CacheShort, createHydrogenContext} from '@shopify/hydrogen';
import {getLocaleFromRequest, getLocalesByDomain} from './i18n';
import type {Localizations, Sites} from './types';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const sites: Sites = {
    isMavalaFrance: env.PUBLIC_STORE_DOMAIN === 'mavala-shop.myshopify.com',
    isMavalaCorporate:
      env.PUBLIC_STORE_DOMAIN === 'mavala-corporate.myshopify.com',
  };

  const locales: Localizations = getLocalesByDomain(sites);

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: getLocaleFromRequest(request, locales),
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  const unstable_storefront = createStorefrontApiClient({
    storeDomain: env.PUBLIC_STORE_DOMAIN,
    apiVersion: 'unstable',
    publicAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
  });

  const admin = createAdminApiClient({
    storeDomain: env.PUBLIC_STORE_DOMAIN,
    apiVersion: '2025-04',
    accessToken: env.PRIVATE_ADMIN_API_TOKEN as string,
  });

  // 1. Configure the Sanity Loader and preview mode
  const sanity = createSanityContext({
    request,
    // Caching mechanism
    cache,
    defaultStrategy: CacheShort(),
    waitUntil,

    // Sanity client configuration
    client: {
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET || 'production',
      apiVersion: env.SANITY_API_VERSION || SANITY_API_VERSION,
      useCdn: process.env.NODE_ENV === 'production',

      // In preview mode, `stega` will be enabled automatically
      // If you need to configure the client's steganography settings,
      // you can do so here
      // stega: {
      //   logger: console,
      // },
    },
    // You can also initialize a client and pass it instead
    // client: createClient({
    //   projectId: env.SANITY_PROJECT_ID,
    //   dataset: env.SANITY_DATASET,
    //   apiVersion: env.SANITY_API_VERSION || '2023-03-30',
    //   useCdn: process.env.NODE_ENV === 'production',
    // }),

    // Optionally, set a default cache strategy, defaults to `CacheLong`
    // strategy: CacheShort() | null,

    // Optionally, enable Visual Editing
    // See "Visual Editing" section below to setup the preview route
    preview: env.SANITY_API_TOKEN
      ? {
          enabled: session.get('projectId') === env.SANITY_PROJECT_ID,
          token: env.SANITY_API_TOKEN,
          studioUrl: '/studio',
        }
      : undefined,
  });

  return {
    ...hydrogenContext,
    unstable_storefront,
    admin,
    sanity,
    sites,
    locales,
    cache,
    waitUntil,
  };
}
