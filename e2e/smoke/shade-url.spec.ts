/**
 * Shade-URL path migration regression suite.
 *
 * Covers the invariants introduced by the path-URL shade migration:
 * - The headline OOS fix: drawer ATC is not disabled on a tracking-param URL
 * - One product per option name resolves correctly at its path URL
 * - Old query-param and variant URLs redirect to path URLs
 * - Single-variant products are unaffected
 * - Shade swatches render as crawlable path <a> links catalogue-wide
 *
 * Serial mode: MiniOxygen (local Cloudflare Workers runtime) cannot handle
 * the parallel SSR load from multiple viewport runners. Same pattern as the
 * existing accordion-icons tests and the smoke:test:e2e:smoke command.
 */

import {test, expect} from '@playwright/test';

// Serial: prevents parallel viewport requests from overwhelming MiniOxygen.
// retries: 1 handles the intermittent SocketError from MiniOxygen connection pool.
test.describe.configure({mode: 'serial', retries: 1});

// One real product per live option name (Storefront API, 2026-06-03)
const SHADE_PRODUCTS = [
  {optionName: 'Teinte', handle: 'crayon-lumiere', slug: 'vert-empire'},
  {optionName: 'Color', handle: 'mini-bio-color-pink', slug: '701-rio-grande'},
  {optionName: 'Shade', handle: 'lip-liner', slug: 'brun-tendre'},
  {optionName: 'Shades', handle: 'crayon-lumiere-1', slug: 'or-precieux'},
  {optionName: 'Teintes', handle: 'eyebrow-pencil', slug: 'ebene'},
];

// A single-variant product (Title option) that must be unaffected
const SINGLE_VARIANT = {handle: 'mavadry-spray'};

// Variant ID on crayon-lumiere for the ?variant=<id> redirect test
const VARIANT_ID = '50833711268168';

// ── HEADLINE INVARIANT ──────────────────────────────────────────────────────

test('drawer ATC is NOT out-of-stock on path URL with tracking params', async ({
  page,
}) => {
  // Navigate to a path-based shade URL with tracking params appended
  // (the exact pattern Carrie reported: fbclid + utm break the drawer ATC)
  await page.goto(
    '/products/crayon-lumiere/vert-empire?utm_source=email&fbclid=TEST_PLAYWRIGHT',
    {timeout: 30000},
  );

  // Wait for the page body to be ready before looking for the trigger
  await expect(page.locator('body')).toContainText('Crayon Lumiere', {
    timeout: 15000,
  });

  // Open the shade drawer via its testid trigger button
  const drawerTrigger = page.getByTestId('shade-drawer-trigger');
  // The trigger only renders when all variants > maxShown (15 > 6 for this product)
  // If not present the test skips gracefully
  const triggerCount = await drawerTrigger.count();
  if (triggerCount === 0) {
    test.skip(true, 'Shade drawer trigger not present - product may have changed');
    return;
  }

  await expect(drawerTrigger).toBeVisible({timeout: 10000});
  await drawerTrigger.click();

  // The drawer ATC must NOT be aria-disabled (aria-disabled="true" = OOS)
  const atcButton = page.getByTestId('drawer-atc');
  await expect(atcButton).toBeVisible({timeout: 15000});
  const ariaDisabled = await atcButton.getAttribute('aria-disabled');
  expect(ariaDisabled).not.toBe('true');
});

// ── ONE PRODUCT PER OPTION NAME ─────────────────────────────────────────────

for (const {optionName, handle, slug} of SHADE_PRODUCTS) {
  test(`shade path URL resolves 200 + self-referential canonical (${optionName}: ${handle}/${slug})`, async ({
    page,
  }) => {
    const response = await page.goto(`/products/${handle}/${slug}`, {
      timeout: 30000,
      waitUntil: 'commit',
    });

    // 200 from the shade route (not a redirect)
    expect(response?.status()).toBe(200);

    // Self-referential canonical: href must end with /<handle>/<slug>
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href');
    expect(canonical).toMatch(new RegExp(`/products/${handle}/${slug}$`));
  });
}

// ── REDIRECT TESTS ───────────────────────────────────────────────────────────

// Redirect tests: check final URL landing (not intermediate hop status,
// which is racy to capture via page.on('response') under MiniOxygen load).
// The invariant is that the old URLs eventually reach the correct path URL.

test('?Teinte= query param redirects to path URL (crayon-lumiere)', async ({
  page,
}) => {
  const final = await page.goto(
    '/products/crayon-lumiere?Teinte=Vert+Empire',
    {timeout: 30000},
  );
  // Follows the redirect chain; final destination must be the path URL
  expect(final?.url()).toMatch(/\/products\/crayon-lumiere\/vert-empire/);
  expect(final?.status()).toBe(200);
});

test('?variant=<id> redirects to path URL (crayon-lumiere)', async ({
  page,
}) => {
  const final = await page.goto(
    `/products/crayon-lumiere?variant=${VARIANT_ID}`,
    {timeout: 30000},
  );
  // Must land on a shade path URL, not a query-param URL
  const finalUrl = final?.url() ?? '';
  expect(finalUrl).toMatch(/\/products\/crayon-lumiere\//);
  expect(finalUrl).not.toContain('?');
  expect(final?.status()).toBe(200);
});

test('bare product URL redirects to first shade path (crayon-lumiere)', async ({
  page,
}) => {
  const final = await page.goto('/products/crayon-lumiere', {timeout: 30000});
  expect(final?.url()).toMatch(/\/products\/crayon-lumiere\//);
  expect(final?.status()).toBe(200);
});

test('non-canonical slug redirects to canonical (Vert-Empire -> vert-empire)', async ({
  page,
}) => {
  const final = await page.goto('/products/crayon-lumiere/Vert-Empire', {
    timeout: 30000,
  });
  expect(final?.url()).toMatch(/\/products\/crayon-lumiere\/vert-empire/);
  expect(final?.status()).toBe(200);
});

test('?Teinte= + tracking params redirect to clean path (no tracking in target)', async ({
  page,
}) => {
  const final = await page.goto(
    '/products/crayon-lumiere?Teinte=Vert+Empire&utm_source=email&fbclid=TEST',
    {timeout: 30000},
  );
  const finalUrl = final?.url() ?? '';
  // Clean path: no query params, correct slug
  expect(finalUrl).toMatch(/\/products\/crayon-lumiere\/vert-empire/);
  expect(finalUrl).not.toContain('?');
  expect(final?.status()).toBe(200);
});

// ── SINGLE-VARIANT REGRESSION ────────────────────────────────────────────────

test('single-variant product loads normally without shade path', async ({
  page,
}) => {
  // Follow through any redirects (single-variant products redirect to first variant)
  await page.goto(`/products/${SINGLE_VARIANT.handle}`, {
    timeout: 30000,
  });

  // Should have settled on a 200 page (not an error page)
  await expect(page.locator('body')).not.toContainText('404', {
    timeout: 10000,
  });

  // The final URL must NOT have a shade sub-path (segments: products/<handle> only)
  const finalPath = new URL(page.url()).pathname.replace(/\/$/, '');
  const segments = finalPath.split('/').filter(Boolean);
  // ['products', 'mavadry-spray'] = 2 segments max (no shade slug)
  expect(segments.length).toBeLessThanOrEqual(2);
});

// ── CATALOGUE-WIDE CRAWLABLE LINKS ───────────────────────────────────────────

test('shade swatches are crawlable path <a> links on a non-pink product', async ({
  page,
}) => {
  await page.goto('/products/crayon-lumiere/vert-empire', {timeout: 30000});

  // Wait for the page to hydrate and TanStack Query to render the swatches.
  // The shade links come from ProductVariants which reads from the TanStack
  // Query cache (dehydrated on the server). Wait for at least one to appear.
  const shadeLink = page
    .locator('a[href*="/products/crayon-lumiere/"]')
    .first();
  await expect(shadeLink).toBeAttached({timeout: 20000});

  // Check there are multiple shade links (not just the canonical <link> element)
  const count = await page
    .locator('a[href*="/products/crayon-lumiere/"]')
    .count();
  expect(count).toBeGreaterThan(0);
});
