import {test, expect, type Page} from '@playwright/test';

const BUNDLE_CANDIDATES = ['lip-shine'];

async function findActiveBundle(page: Page): Promise<string | null> {
  for (const handle of BUNDLE_CANDIDATES) {
    const response = await page.goto(`/products/${handle}`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    if (!response || response.status() >= 400) continue;
    const isBundle = await page
      .getByTestId('bundle-helper-text')
      .or(page.getByTestId('bundle-atc'))
      .first()
      .isVisible()
      .catch(() => false);
    if (isBundle) return handle;
  }
  return null;
}

test.describe('bundle shade button', () => {
  let activeBundle: string | null = null;

  test.beforeAll(async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    activeBundle = await findActiveBundle(page);
    await context.close();
  });

  test.beforeEach(async () => {
    test.skip(
      activeBundle === null,
      'bundles dormant on storefront: no product currently renders BundleMain. ' +
        'Per backlog "Bundle code dormant on production": the route gate uses ' +
        'productType === "Bundle" but no product has that productType set. ' +
        'Test will auto-activate once any product renders BundleMain.',
    );
  });

  test('helper text or ATC visible on bundle PDP', async ({page}) => {
    await page.goto(`/products/${activeBundle}`);

    const helper = page.getByTestId('bundle-helper-text');
    const atc = page.getByTestId('bundle-atc');

    const helperVisible = await helper.isVisible().catch(() => false);
    const atcVisible = await atc.isVisible().catch(() => false);

    // Either helper text or ATC must be visible (mutually exclusive states)
    expect(helperVisible || atcVisible).toBe(true);
    expect(helperVisible && atcVisible).toBe(false);
  });
});
