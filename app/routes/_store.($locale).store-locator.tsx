import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  createWithCache,
  CacheCustom,
  getSeoMeta,
  type SeoConfig,
} from '@shopify/hydrogen';
import { useLoaderData, type MetaFunction } from 'react-router';
import type {RootLoader} from '~/root';
import {truncate} from '~/lib/utils';
import {Breadcrumb} from '~/components/common/Breadcrumb';
import StoreLocatorMain from '~/components/storelocator/StoreLocatorMain';
import {getStores} from '~/lib/stores';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  data,
  matches: [root],
}) => {
  return getSeoMeta(root.data.seo, data?.seo);
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront, env, sites, cache, waitUntil} = context;

  if (sites?.isMavalaCorporate) {
    throw new Response(`Store Locator page not found`, {
      status: 404,
    });
  }

  const [{storesPage}, stores] = await Promise.all([
    storefront.query(STORES_PAGE_QUERY, {
      variables: {handle: {handle: 'stores', type: 'stores'}},
      cache: storefront.CacheShort(),
    }),
    createWithCache({cache, waitUntil, request}).run(
      {
        cacheKey: ['stores'],
        cacheStrategy: CacheCustom({maxAge: 60 * 60 * 24}),
        shouldCacheResult: (result) => !!result,
      },
      getStores,
    ),
  ]);

  if (!storesPage || !stores) {
    throw new Response('Stores not found', {status: 404});
  }

  const {title, description} = storesPage?.seo ?? {};
  const seo = {
    title: title?.value ?? '',
    description: truncate(description?.value!) ?? '',
  } satisfies SeoConfig;

  return {storesPage, stores, mapboxAccessToken: env.MAPBOX_ACCESS_TOKEN, seo};
}

export default function StoreLocator() {
  const {storesPage} = useLoaderData<typeof loader>();

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: storesPage?.title?.value!,
          },
        ]}
      />
      <StoreLocatorMain />
    </>
  );
}

const STORES_PAGE_QUERY = `#graphql
  query StoresPage(
    $language: LanguageCode
    $country: CountryCode
    $handle: MetaobjectHandleInput!
  ) @inContext(language: $language, country: $country) {
    storesPage: metaobject(handle: $handle) {
      title: field(key: "title") {
        value
      }
      description: field(key: "description") {
        value
      }
      seo {
        title {
          value
        }
        description {
          value
        }
      }
    }
  }
` as const;
