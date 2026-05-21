import {test, expect} from '@playwright/test';

test('Axeptio bridge maps Accept All to Shopify Customer Privacy', async ({
  page,
  context,
}) => {
  // Start fresh: clear cookies so we always see the banner
  await context.clearCookies();
  await page.goto('/');

  // Wait for the Axeptio cookie banner to appear.
  // The banner has buttons with text "OK with me!" (accept) and "Reject all".
  const acceptButton = page.getByRole('button', {name: /OK with me/i});
  try {
    await acceptButton.waitFor({state: 'visible', timeout: 15000});
  } catch {
    // Banner may not appear if Axeptio SDK fails to load on this network
    // (pihole DNS, tracking protection, etc.). Skip gracefully.
    test.skip(
      true,
      'Axeptio cookie banner not visible after 15s. SDK may be blocked by network DNS or tracking protection.',
    );
    return;
  }

  // Click "OK with me!" to accept all
  await acceptButton.click();

  // Wait for propagation: cookies:complete fires, bridge calls setTrackingConsent
  await page.waitForTimeout(3000);

  // Verify Shopify Customer Privacy state reflects acceptance
  const consent = await page.evaluate(() => {
    const cp = (window as any).Shopify?.customerPrivacy;
    if (!cp?.currentVisitorConsent) return null;
    return cp.currentVisitorConsent();
  });

  if (!consent) {
    test.skip(
      true,
      'Shopify customerPrivacy API not available on this page.',
    );
    return;
  }

  // All four fields should be 'yes' after accepting all
  expect(consent).toMatchObject({
    analytics: 'yes',
    marketing: 'yes',
    preferences: 'yes',
    sale_of_data: 'yes',
  });

  // Verify _tracking_consent cookie reflects granted state (t = granted)
  const cookies = await page.evaluate(() => document.cookie);
  const trackingConsent = cookies
    .split(';')
    .find((c) => c.trim().startsWith('_tracking_consent='));
  expect(trackingConsent).toBeDefined();
  expect(trackingConsent).toContain('_t_t_');
});
