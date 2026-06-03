import groq from 'groq';
import {getSitemap} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {SitemapQueryResult} from 'sanity.generated';
import {SHADE_OPTION_ALLOWLIST, slugifyShade, buildShadePath} from '~/lib/shadeUrl';

const SITEMAP_PREFIX = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
const SITEMAP_SUFFIX = `</urlset>`;

export async function loader({
  request,
  params,
  context: {storefront, sanity, locales},
}: LoaderFunctionArgs) {
  const {type} = params;
  const {pathPrefix} = storefront.i18n;
  const baseUrl = new URL(request.url).origin;

  if (type === 'products') {
    // Custom product sitemap: bare product URLs + per-shade path URLs.
    // Replaces Hydrogen's getSitemap for the product type so we can emit
    // /products/<handle>/<shade-slug> for every multi-variant shade.
    //
    // All ~155 products + ~600 shade URLs fit on page 1 (well under 50k).
    // Page 2+ returns an empty sitemap for compatibility with the index.
    const {params} = {params: {page: new URL(request.url).pathname.match(/\/(\d+)\.xml/)?.[1] ?? '1'}};
    const page = parseInt(String(params.page), 10);

    if (page > 1) {
      // Pages beyond 1 are empty (all entries fit on page 1)
      return new Response(`${SITEMAP_PREFIX}${SITEMAP_SUFFIX}`, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': `max-age=${60 * 60 * 24}`,
        },
      });
    }

    const {products} = await storefront.query(PRODUCTS_FOR_SITEMAP_QUERY, {
      cache: storefront.CacheLong(),
    });

    const allProducts: Array<{
      handle: string;
      updatedAt: string;
      options: Array<{name: string; optionValues: Array<{name: string}>}>;
    }> = products?.nodes ?? [];

    const entries: string[] = [];

    for (const product of allProducts) {
      const productUrl = `${baseUrl}${pathPrefix}/products/${product.handle}`;
      const lastmod = new Date(product.updatedAt).toISOString();

      // Bare product entry (present for all products)
      entries.push(`
          <url>
            <loc>${productUrl}</loc>
            <lastmod>${lastmod}</lastmod>
            <changefreq>weekly</changefreq>
          </url>`);

      // Shade path entries for multi-variant products
      const shadeOption = product.options.find(
        (o) =>
          o.optionValues.length > 1 &&
          SHADE_OPTION_ALLOWLIST.has(o.name.toLowerCase()),
      );

      if (shadeOption) {
        const seen = new Set<string>();
        for (const {name: value} of shadeOption.optionValues) {
          const slug = slugifyShade(value);
          if (!slug || seen.has(slug)) continue; // skip empty slugs + collisions
          seen.add(slug);
          const shadePath = buildShadePath(product.handle, value, pathPrefix);
          entries.push(`
          <url>
            <loc>${baseUrl}${shadePath}</loc>
            <lastmod>${lastmod}</lastmod>
            <changefreq>weekly</changefreq>
          </url>`);
        }
      }
    }

    return new Response(`${SITEMAP_PREFIX}${entries.join('')}${SITEMAP_SUFFIX}`, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `max-age=${60 * 60 * 24}`,
      },
    });
  }

  if (type === 'sanity') {
    const {data} = await sanity.loadQuery<SitemapQueryResult>(sitemapQuery);

    const urls = data
      .map(
        (page) => `
          <url>
            <loc>${baseUrl}${page.path}</loc>
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

const PRODUCTS_FOR_SITEMAP_QUERY = `#graphql
  query ProductsForSitemap(
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    products(first: 250) {
      nodes {
        handle
        updatedAt
        options {
          name
          optionValues {
            name
          }
        }
      }
    }
  }
` as const;

const sitemapQuery = groq`
  *[
    _type == "home" ||
    (_type == "page" && slug.current != "blog") ||
    (_type == "article" && defined(slug.current) && defined(category->slug.current))
  ] {
    _updatedAt,
    "path": select(
      _type == "home" => "/",
      _type == "page" => "/pages/" + slug.current,
      _type == "article" => "/blog/" + category->slug.current + "/" + slug.current
    )
  }
`;
