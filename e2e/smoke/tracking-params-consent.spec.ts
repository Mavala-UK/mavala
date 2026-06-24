/**
 * Google Ads tracking-param + Axeptio consent regression suite.
 *
 * Guards the fix on fix/preserve-tracking-params-on-redirect (9e784a5).
 *
 * The 9 June shade-URL work (da00732) stripped marketing params (gclid etc.)
 * on redirects AND on in-page shade/option switches, which killed Google Ads
 * conversion tracking. The Google tag only writes the _gcl_aw conversion cookie
 * when it can see the gclid at the moment consent is granted. If an in-page
 * shade click strips the gclid before the visitor accepts cookies, the
 * conversion is lost.
 *
 * The invariants encoded here (verified live on 9e784a5):
 *  1. In-page shade switch keeps gclid in the URL (the core regression guard).
 *  2. No tracking param -> clean canonical hrefs (the SEO invariant).
 *  3. Non-shade RadioGroup (Packaging) selection keeps gclid.
 *  4. The full consent-timing flow ("scenario 3"): switch shade before consent,
 *     then accept, and the Google tag writes _gcl_aw with the gclid.
 *
 * Tests 1-3 only exercise URL/href behaviour and run anywhere the storefront
 * renders. Test 4 depends on GTM (GTM-WM26WWGT) + Axeptio actually loading,
 * which is reliable on a deployed preview/prod but not on local pnpm dev, so it
 * skips against localhost and when the banner/tag never appear.
 *
 * Serial mode: MiniOxygen (local Cloudflare Workers runtime) cannot handle the
 * parallel SSR load from multiple viewport runners. Same pattern as the
 * shade-url and accordion-icons tests.
 */

import {test, expect} from '@playwright/test';

// Serial: prevents parallel viewport requests from overwhelming MiniOxygen.
// retries: 1 handles the intermittent SocketError from MiniOxygen connection pool.
test.describe.configure({mode: 'serial', retries: 1});

const SHADE_PRODUCT = 'mini-color-pink';
const SHADE_SLUG = '9-lisboa';
const GCLID = 'TESTGCLID123';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const isLocalhost = /localhost|127\.0\.0\.1/.test(baseUrl);

// ── 1. IN-PAGE SHADE SWITCH PRESERVES GCLID (core regression guard) ──────────

test('in-page shade switch preserves gclid + utm in the URL', async ({page}) => {
  await page.goto(
    `/products/${SHADE_PRODUCT}/${SHADE_SLUG}?gclid=${GCLID}&utm_source=playwright`,
    {timeout: 30000},
  );

  // The shade swatches are crawlable <a> links. The active one carries
  // data-active="true"; pick a different shade (no data-active).
  const otherShade = page
    .locator(`a[href*="/products/${SHADE_PRODUCT}/"]:not([data-active])`)
    .first();
  await expect(otherShade).toBeAttached({timeout: 20000});

  // The href must re-append the marketing params (gclid + utm_source).
  const href = await otherShade.getAttribute('href');
  expect(href).toContain(`gclid=${GCLID}`);
  expect(href).toContain('utm_source=playwright');

  // The target slug must differ from the current one (so the click navigates).
  const targetPath = new URL(href!, baseUrl).pathname;
  expect(targetPath).not.toContain(`/${SHADE_SLUG}`);

  await otherShade.click();

  // Wait for the PATH to actually change to the new shade. (Polling for the
  // gclid alone would pass instantly, since the starting URL already carries
  // it; the path change is what proves the client-side navigation happened.)
  await expect
    .poll(() => new URL(page.url()).pathname, {timeout: 15000})
    .not.toContain(`/${SHADE_SLUG}`);

  // The new URL must still be a product shade path AND retain the marketing
  // params (the core regression guard: gclid + utm survived the in-page switch).
  const finalUrl = new URL(page.url());
  expect(finalUrl.pathname).toContain(`/products/${SHADE_PRODUCT}/`);
  expect(finalUrl.search).toContain(`gclid=${GCLID}`);
  expect(finalUrl.search).toContain('utm_source=playwright');
});

// ── 2. SEO INVARIANT: no tracking param -> clean canonical hrefs ──────────────

test('no tracking param -> shade hrefs are clean canonical paths (no query)', async ({
  page,
}) => {
  await page.goto(`/products/${SHADE_PRODUCT}/${SHADE_SLUG}`, {timeout: 30000});

  const shadeLinks = page.locator(`a[href*="/products/${SHADE_PRODUCT}/"]`);
  await expect(shadeLinks.first()).toBeAttached({timeout: 20000});

  const hrefs = await shadeLinks.evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).getAttribute('href') ?? ''),
  );
  expect(hrefs.length).toBeGreaterThan(0);

  // Every shade href must be a clean path with no query string.
  for (const href of hrefs) {
    expect(href).not.toContain('?');
  }
});

// ── 3. NON-SHADE RADIOGROUP (Packaging) PRESERVES GCLID ──────────────────────

test('non-shade Packaging selection preserves gclid in the URL', async ({
  page,
}) => {
  const response = await page.goto(`/products/nailactan?gclid=${GCLID}`, {
    timeout: 30000,
    waitUntil: 'commit',
  });

  // Skip if the product no longer exists on the storefront (suite skip pattern).
  if (response && response.status() >= 400) {
    test.skip(true, 'nailactan product not available (4xx) - catalogue changed.');
    return;
  }

  await expect(page.locator('body')).toContainText('Nailactan', {
    timeout: 15000,
  });

  // The non-active Packaging radio: radix RadioGroup.Item rendered as a button
  // whose value is JSON.stringify({name, value}). Pick the one that is NOT
  // currently active (no data-active attribute).
  const radioCount = await page.locator('button[role="radio"]').count();
  if (radioCount === 0) {
    test.skip(true, 'Packaging RadioGroup not rendered - product may have changed.');
    return;
  }
  const inactiveRadio = page
    .locator('button[role="radio"]:not([data-active])')
    .first();
  await expect(inactiveRadio).toBeVisible({timeout: 15000});
  await inactiveRadio.click();

  // The rebuilt query must contain the chosen Packaging value AND the gclid.
  await expect.poll(() => page.url(), {timeout: 15000}).toContain('Packaging=');
  expect(page.url()).toContain(`gclid=${GCLID}`);
});

// ── 4. FULL CONSENT-TIMING FLOW ("scenario 3"): writes _gcl_aw with the gclid ─

test('consent after a pre-consent shade switch writes _gcl_aw with the gclid', async ({
  page,
  context,
}) => {
  // GTM + Axeptio do not load reliably on local pnpm dev; only run this
  // meaningfully against a deployed URL.
  test.skip(
    isLocalhost,
    'GTM/Axeptio do not load reliably on localhost - run against a deployed URL.',
  );

  // Fresh context: no consent cookie, so the banner appears.
  await context.clearCookies();

  await page.goto(`/products/${SHADE_PRODUCT}/${SHADE_SLUG}?gclid=${GCLID}`, {
    timeout: 30000,
  });

  // The Axeptio accept button renders inside an open shadow DOM; Playwright's
  // getByRole pierces open shadow roots (confirmed by axeptio-bridge.spec.ts).
  const acceptButton = page.getByRole('button', {name: /OK with me/i});
  try {
    await acceptButton.waitFor({state: 'visible', timeout: 15000});
  } catch {
    test.skip(
      true,
      'Axeptio cookie banner not visible after 15s. SDK/GTM may be blocked by network DNS or tracking protection.',
    );
    return;
  }

  // _gcl_aw must NOT be set before consent is granted.
  const preConsentGclAw = (await context.cookies()).find(
    (c) => c.name === '_gcl_aw',
  );
  expect(preConsentGclAw).toBeUndefined();

  // Switch shade FIRST (before consent). The gclid must survive the switch.
  const otherShade = page
    .locator(`a[href*="/products/${SHADE_PRODUCT}/"]:not([data-active])`)
    .first();
  await expect(otherShade).toBeAttached({timeout: 20000});
  await otherShade.click();
  // Wait for the path to change (proves the switch happened), then confirm the
  // gclid survived the pre-consent shade switch.
  await expect
    .poll(() => new URL(page.url()).pathname, {timeout: 15000})
    .not.toContain(`/${SHADE_SLUG}`);
  expect(new URL(page.url()).search).toContain(`gclid=${GCLID}`);

  // The accept button persists across the client-side shade navigation.
  await expect(acceptButton).toBeVisible({timeout: 15000});
  await acceptButton.click();

  // The Google tag writes _gcl_aw asynchronously after consent. Poll for it.
  await expect
    .poll(
      async () => {
        const gclAw = (await context.cookies()).find(
          (c) => c.name === '_gcl_aw',
        );
        return gclAw?.value ?? null;
      },
      {
        timeout: 20000,
        message:
          'Expected the Google tag to write _gcl_aw=GCL.<digits>.' +
          GCLID +
          ' after consent. If GTM did not load, this assertion is meaningless.',
      },
    )
    .toMatch(new RegExp(`^GCL\\.\\d+\\.${GCLID}$`));
});
