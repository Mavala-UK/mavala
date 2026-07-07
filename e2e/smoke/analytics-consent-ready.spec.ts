/**
 * Shopify analytics "ready() blackout" regression suite.
 *
 * Guards the fix on fix/analytics-ready-consent.
 *
 * Hydrogen's Analytics.Provider queues ALL analytics events until every
 * registered integration calls ready(). Our Axeptio integration
 * (app/lib/axeptio.ts) used to call ready() only inside Axeptio's
 * cookies:complete callback, which fires only when the visitor clicks a
 * banner button. Visitors who IGNORED the banner never unfroze the queue, so
 * zero events (including the trekkie_storefront_page_view carrying the
 * landing URL's gclid/UTMs) reached Shopify monorail for their whole session.
 * Orders then recorded as "1st session from mavala.co.uk" self-referrals.
 *
 * Invariants encoded here:
 *  1. A fresh visitor who never touches the consent banner still produces a
 *     Shopify analytics page-view request carrying the landing URL's
 *     tracking params (the repaired cohort).
 *  2. A visitor who explicitly DENIES consent ("Continue without consent")
 *     stays dark: no new analytics page-view after denial. This one depends
 *     on Axeptio actually loading, so it skips on localhost and when the
 *     banner never appears.
 *
 * Serial mode: MiniOxygen (local Cloudflare Workers runtime) cannot handle
 * the parallel SSR load from multiple viewport runners. Same pattern as the
 * shade-url and tracking-params-consent tests.
 */

import {test, expect} from '@playwright/test';
import type {Page, Request} from '@playwright/test';

test.describe.configure({mode: 'serial', retries: 1});

const SHADE_PRODUCT = 'mini-color-pink';
const SHADE_SLUG = '9-lisboa';
const GCLID = 'E2ETESTGCLID';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const isLocalhost = /localhost|127\.0\.0\.1/.test(baseUrl);

// Shopify's Hydrogen analytics ship to monorail
// (monorail-edge.shopifysvc.com/unstable/produce_batch) with
// trekkie_storefront_page_view event payloads.
const ANALYTICS_PATTERN = /monorail|trekkie_storefront_page_view/i;

type CapturedRequest = {url: string; body: string};

/** Attach a request listener BEFORE navigation; returns the capture array. */
function captureAnalyticsRequests(page: Page): CapturedRequest[] {
  const captured: CapturedRequest[] = [];
  page.on('request', (request: Request) => {
    const url = request.url();
    const body = request.postData() ?? '';
    if (ANALYTICS_PATTERN.test(url) || ANALYTICS_PATTERN.test(body)) {
      captured.push({url, body});
    }
  });
  return captured;
}

// ── 1. BANNER-IGNORING VISITOR STILL SENDS THE PAGE-VIEW (core guard) ────────

test('fresh visitor who ignores the banner still sends a Shopify page-view with the gclid', async ({
  page,
  context,
}) => {
  // Fresh visitor: no consent cookie, banner (if it loads) stays untouched.
  await context.clearCookies();

  const captured = captureAnalyticsRequests(page);

  const landingPath = `/products/${SHADE_PRODUCT}/${SHADE_SLUG}?gclid=${GCLID}&utm_source=playwright-guard`;
  const response = await page.goto(landingPath, {timeout: 30000});
  if (response && response.status() >= 400) {
    test.skip(
      true,
      `${SHADE_PRODUCT} product not available (4xx) - catalogue changed.`,
    );
    return;
  }

  // Do NOT interact with the banner. The Analytics.Provider queue must still
  // flush: poll for a monorail/trekkie request whose payload carries the
  // gclid from the landing URL.
  await expect
    .poll(
      () =>
        captured.find((r) => r.body.includes(GCLID) || r.url.includes(GCLID)) ??
        null,
      {
        timeout: 20000,
        message:
          'Expected a Shopify analytics (monorail/trekkie) page-view request ' +
          `containing gclid=${GCLID} without any banner interaction. If none ` +
          'fired, the Analytics.Provider queue is frozen again (ready() ' +
          'regression in app/lib/axeptio.ts).',
      },
    )
    .not.toBeNull();

  // Soft assertion: the payload should carry the full landing URL (path +
  // tracking params), which is what restores acquisition attribution.
  const match = captured.find(
    (r) => r.body.includes(GCLID) || r.url.includes(GCLID),
  )!;
  const payload = match.body || match.url;
  expect
    .soft(
      payload,
      'Analytics payload should contain the landing URL with its tracking params',
    )
    .toContain(`utm_source=playwright-guard`);
  expect
    .soft(payload, 'Analytics payload should reference the landing product path')
    .toContain(`/products/${SHADE_PRODUCT}/`);
});

// ── 2. EXPLICIT DENIER STAYS DARK ─────────────────────────────────────────────

test('visitor who denies consent sends no new analytics page-view after denial', async ({
  page,
  context,
}) => {
  // Axeptio does not load reliably on local pnpm dev; the denial path needs
  // the real banner, so only run against a deployed URL.
  test.skip(
    isLocalhost,
    'Axeptio does not load reliably on localhost - run against a deployed URL.',
  );

  await context.clearCookies();

  const captured = captureAnalyticsRequests(page);

  await page.goto(`/products/${SHADE_PRODUCT}/${SHADE_SLUG}`, {timeout: 30000});

  // The Axeptio buttons render inside an open shadow DOM; getByRole pierces
  // open shadow roots (confirmed by axeptio-bridge.spec.ts).
  const denyButton = page.getByRole('button', {
    name: /Continue without consent/i,
  });
  try {
    await denyButton.waitFor({state: 'visible', timeout: 15000});
  } catch {
    test.skip(
      true,
      'Axeptio cookie banner not visible after 15s. SDK may be blocked by network DNS or tracking protection.',
    );
    return;
  }
  await denyButton.click();

  // Give the bridge time to propagate the denial to Customer Privacy
  // (cookies:complete -> setTrackingConsent), then measure from a clean slate.
  await page.waitForTimeout(3000);
  const countAfterDenial = captured.length;

  // Navigate to another page. With consent denied, Hydrogen's canTrack gate
  // must keep the queue dark: no new analytics page-view request.
  await page.goto('/', {timeout: 30000});
  await page.waitForTimeout(8000);

  const newRequests = captured.slice(countAfterDenial);
  const newPageViews = newRequests.filter((r) =>
    /trekkie_storefront_page_view|page_view/i.test(r.body + r.url),
  );
  expect(
    newPageViews,
    'No analytics page-view should fire after the visitor explicitly denied consent',
  ).toHaveLength(0);
});
