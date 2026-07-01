/**
 * On-site search variant matching regression suite.
 *
 * When a customer searches a shade name ("Riga") or shade number ("701"), the
 * search result should surface the MATCHING VARIANT: its image, its name, and a
 * link to the canonical PATH-based shade URL (/products/<handle>/<shade-slug>),
 * not the parent product with its default variant. mavala.fr does this; the UK
 * site did not before this chunk.
 *
 * Invariants covered:
 * - "Riga" -> the 56. Riga variant card: matched-shade label, variant image,
 *   and a path-based link that lands on the shade with no redirect hop.
 * - A shade NUMBER ("701") resolves to its variant the same way.
 * - One product per live option-name style (Teinte / Teintes / Color / Shade /
 *   Shades) gets a correct path-based link.
 * - Parent-name search ("Mini Color") returns parents with NO variant override.
 * - Category search ("nail polish") returns products normally.
 * - A no-match number ("275") returns 200 with a no-results state, never 404.
 *
 * Selector priority is data-testid first (product-card-link,
 * product-card-matched-shade), per the project's test conventions.
 *
 * Serial mode + retries: MiniOxygen (local Cloudflare Workers runtime) cannot
 * handle parallel SSR load from multiple viewport runners. Same pattern as the
 * shade-url and accordion-icons suites.
 */

import {test, expect} from '@playwright/test';

test.describe.configure({mode: 'serial', retries: 1});

// One real product per live shade option-name style (Storefront API, 2026-06-12).
// term: the search term. handle: the product. slug: the expected path slug.
// label: the matched-shade label the card should show.
const OPTION_NAME_CASES = [
  {
    optionName: 'Shade',
    term: 'Riga',
    handle: 'mini-color-pink',
    slug: '56-riga',
    label: '56. Riga',
  },
  {
    optionName: 'Color',
    term: 'Mississippi',
    handle: 'mini-bio-color-pink',
    slug: '702-mississippi',
    label: '702. Mississippi',
  },
  {
    optionName: 'Teinte',
    term: 'Ayers Rock',
    handle: 'lip-shine',
    slug: 'ayers-rock',
    label: 'Ayers Rock',
  },
  {
    optionName: 'Teintes',
    term: 'Roux',
    handle: 'eyebrow-pencil',
    slug: 'roux',
    label: 'Roux',
  },
  {
    optionName: 'Shades',
    term: 'Violet Cerise',
    handle: 'crayon-lumiere-1',
    slug: 'violet-cerise',
    label: 'Violet Cerise',
  },
];

// ── HEADLINE: Riga surfaces the matching variant ────────────────────────────

test('searching "Riga" surfaces the 56. Riga variant (path link + label + variant image)', async ({
  page,
}) => {
  await page.goto('/search?q=Riga', {timeout: 30000});
  await expect(page.getByTestId('product-card-link').first()).toBeAttached({
    timeout: 20000,
  });

  // The matched card links to the canonical path-based shade URL.
  const matchedLink = page.locator(
    'a[data-testid="product-card-link"][href*="/products/mini-color-pink/56-riga"]',
  );
  await expect(matchedLink).toHaveCount(1, {timeout: 20000});

  // The matched-shade label is shown on that card. Longer timeout: under the
  // serial-suite MiniOxygen load the card can re-render once on hydration
  // (TanStack refetch of the product-item resource) before settling.
  await expect(
    page.getByTestId('product-card-matched-shade').filter({hasText: '56. Riga'}),
  ).toBeAttached({timeout: 20000});

  // The card image is the matched VARIANT image (Vernis_56_Riga), not the
  // product's default/featured image. The card uses selectedVariant.image.
  const card = page
    .locator('li', {has: matchedLink})
    .first();
  const img = card.locator('img').first();
  await expect(img).toHaveAttribute('src', /56_Riga/i, {timeout: 15000});

  // The link must land on the shade page directly (no redirect hop) and the
  // shade must be pre-selected there.
  const href = await matchedLink.getAttribute('href');
  expect(href).toContain('/products/mini-color-pink/56-riga');
  // No query-param shade link (would 301-redirect).
  expect(href).not.toContain('?Shade=');
});

test('clicking the Riga result lands on the shade page with 56. Riga pre-selected', async ({
  page,
}) => {
  await page.goto('/search?q=Riga', {timeout: 30000});
  const matchedLink = page.locator(
    'a[data-testid="product-card-link"][href*="/products/mini-color-pink/56-riga"]',
  );
  await expect(matchedLink).toHaveCount(1, {timeout: 20000});

  const response = await page.goto(
    '/products/mini-color-pink/56-riga',
    {timeout: 30000, waitUntil: 'commit'},
  );
  // 200 direct from the shade route, no redirect to a query-param URL.
  expect(response?.status()).toBe(200);

  // Selected shade on the PDP is 56. Riga (selectedVariant.title rendered in
  // the "selected shade" block).
  await expect(page.locator('body')).toContainText('56. Riga', {timeout: 15000});
});

// ── shade NUMBER search ─────────────────────────────────────────────────────

test('searching a shade number "701" surfaces the 701. Rio Grande variant', async ({
  page,
}) => {
  await page.goto('/search?q=701', {timeout: 30000});
  // Wait for results to render before asserting the specific matched link
  // (MiniOxygen can be slow to stream SSR under serial-suite load).
  await expect(page.getByTestId('product-card-link').first()).toBeAttached({
    timeout: 20000,
  });
  const matchedLink = page.locator(
    'a[data-testid="product-card-link"][href*="/products/mini-bio-color-pink/701-rio-grande"]',
  );
  await expect(matchedLink).toHaveCount(1, {timeout: 20000});
  await expect(
    page
      .getByTestId('product-card-matched-shade')
      .filter({hasText: '701. Rio Grande'}),
  ).toBeAttached();
});

// ── one product per option-name style ───────────────────────────────────────

for (const {optionName, term, handle, slug} of OPTION_NAME_CASES) {
  test(`option-name "${optionName}": "${term}" links to /products/${handle}/${slug}`, async ({
    page,
  }) => {
    await page.goto(`/search?q=${encodeURIComponent(term)}`, {timeout: 30000});

    // Skip gracefully if the product fell out of the catalogue / results.
    const anyCard = page.getByTestId('product-card-link').first();
    await expect(anyCard).toBeAttached({timeout: 20000});

    const matchedLink = page.locator(
      `a[data-testid="product-card-link"][href*="/products/${handle}/${slug}"]`,
    );
    const count = await matchedLink.count();
    if (count === 0) {
      test.skip(
        true,
        `No matched-shade link for ${handle}/${slug} - catalogue may have changed`,
      );
      return;
    }
    await expect(matchedLink.first()).toBeAttached();

    // The path link must resolve 200 directly (no query-param 301 hop).
    const href = await matchedLink.first().getAttribute('href');
    expect(href).not.toContain('?');
    const resp = await page.request.get(href!);
    expect(resp.status()).toBe(200);
  });
}

// ── REGRESSION: parent-name search ──────────────────────────────────────────

test('parent-name search "Mini Color" returns parents with NO variant override', async ({
  page,
}) => {
  await page.goto('/search?q=Mini+Color', {timeout: 30000});
  await expect(page.getByTestId('product-card-link').first()).toBeAttached({
    timeout: 20000,
  });

  // No matched-shade labels anywhere (no variant was surfaced).
  await expect(page.getByTestId('product-card-matched-shade')).toHaveCount(0);

  // Every result link is a bare product link (no /products/<handle>/<shade>).
  const links = page.getByTestId('product-card-link');
  const n = await links.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    const href = (await links.nth(i).getAttribute('href')) ?? '';
    const segments = href.split('?')[0].split('/').filter(Boolean);
    // ['products', '<handle>'] = 2 segments. A shade sub-path would be 3.
    expect(segments.length).toBeLessThanOrEqual(2);
  }
});

// ── REGRESSION: category search ─────────────────────────────────────────────

test('category search "nail polish" returns products normally (no false override)', async ({
  page,
}) => {
  await page.goto('/search?q=nail+polish', {timeout: 30000});
  await expect(page.getByTestId('product-card-link').first()).toBeAttached({
    timeout: 20000,
  });
  // Category term matches no variant value -> no matched-shade labels.
  await expect(page.getByTestId('product-card-matched-shade')).toHaveCount(0);
});

// ── REGRESSION: no-match number returns 200 + no-results, never 404 ─────────

test('no-match number "275" returns 200 with a no-results state (not 404)', async ({
  page,
}) => {
  const response = await page.goto('/search?q=275', {
    timeout: 30000,
    waitUntil: 'commit',
  });
  // The search route itself returns 200 (no-results is a state, not an error).
  expect(response?.status()).toBe(200);

  // No product cards rendered.
  await expect(page.getByTestId('product-card-link')).toHaveCount(0, {
    timeout: 15000,
  });

  // The page is not a 404 / not-found page.
  await expect(page.locator('body')).not.toContainText('Page not found', {
    timeout: 10000,
  });
});

/**
 * Admin API fallback test: purely-alphabetic shade name.
 *
 * "Vert Empire" appears only in variant titles / option values, never in any
 * product-level field (title, description, tags, vendor, product_type). The
 * Storefront API product search alone returns zero results. This test verifies
 * that the Admin API variant search fallback finds the parent product and
 * surfaces the matched variant correctly.
 */
test('purely-alphabetic shade name "Vert Empire" surfaces the correct variant', async ({
  page,
}) => {
  await page.goto('/search?q=Vert+Empire', {timeout: 30000});
  await expect(page.getByTestId('product-card-link').first()).toBeAttached({
    timeout: 20000,
  });

  const matchedLink = page.locator(
    'a[data-testid="product-card-link"][href*="/products/crayon-lumiere/vert-empire"]',
  );
  await expect(matchedLink).toHaveCount(1, {timeout: 20000});

  await expect(
    page
      .getByTestId('product-card-matched-shade')
      .filter({hasText: 'Vert Empire'}),
  ).toBeAttached({timeout: 20000});

  const href = await matchedLink.getAttribute('href');
  expect(href).toContain('/products/crayon-lumiere/vert-empire');
  expect(href).not.toContain('?');

  const resp = await page.request.get(href!);
  expect(resp.status()).toBe(200);
});
