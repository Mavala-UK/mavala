import groq from 'groq';
import {getSitemap} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {SitemapQueryResult} from 'sanity.generated';

const SITEMAP_PREFIX = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
const SITEMAP_SUFFIX = `</urlset>`;

export async function loader({
  request,
  params,
  context: {storefront, sanity, locales},
}: LoaderFunctionArgs) {
  const {type} = params;
  const {language, pathPrefix} = storefront.i18n;
  const baseUrl = new URL(request.url).origin;

  if (type === 'sanity') {
    const {data} = await sanity.loadQuery<SitemapQueryResult>(sitemapQuery);

    const urls = data
      .map(
        (page) => `
          <url>
            <loc>${baseUrl}/${language.toLowerCase()}${page.path}</loc>
            <lastmod>${new Date(page._updatedAt).toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
          </url>
        `,
      )
      .join('\n');

    return new Response(`${SITEMAP_PREFIX}${urls}${SITEMAP_SUFFIX}`, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `max-age=${60 * 60 * 24}`,
      },
    });
  }

  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: Object.values(locales).flatMap(({language}) =>
      language.toLowerCase(),
    ),
    getLink: ({type, baseUrl, handle, locale}) => {
      if (!locale) return `${baseUrl}/${type}/${handle}`;
      return `${baseUrl}${pathPrefix}/${type}/${handle}`;
    },
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}

const sitemapQuery = groq`
  *[_type == "home" || _type == "page"] {
    _updatedAt,
    "path": select(
      _type == "home" => "/",
      _type == "page" => "/pages/" + slug.current
    )
  }
`;
