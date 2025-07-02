import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ManifestQuery} from 'storefrontapi.generated';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const {shop} = await context.storefront.query<ManifestQuery>(MANIFEST_QUERY);

  const manifest = {
    name: shop.name,
    start_url: url.origin,
    icons: [
      {
        src: '/icons/icon512_maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icons/icon512_rounded.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    theme_color: 'white',
    background_color: 'white',
    display: 'browser',
    orientation: 'any',
  };

  return Response.json(manifest, {
    headers: {
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

const MANIFEST_QUERY = `#graphql
  query Manifest {
    shop {
      name
    }
  }
`;
