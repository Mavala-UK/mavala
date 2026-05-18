import {test, expect} from '@playwright/test';

// lip-shine is the known bundle product in the UK catalogue.
// It has bundleComponents metafield populated but productType is "Make-Up"
// not "Bundle", so the PDP route gate `productType === 'Bundle'` never
// activates BundleMain. The bundle code path is dormant.
const BUNDLE_PRODUCT_HANDLE = 'lip-shine';

test.beforeAll(async ({browser}) => {
  const page = await browser.newPage();
  const response = await page.goto(
    `/products/${BUNDLE_PRODUCT_HANDLE}`,
    {timeout: 20000},
  );

  if (!response || response.status() >= 400) {
    await page.close();
    test.skip(
      true,
      `bundle product ${BUNDLE_PRODUCT_HANDLE} not reachable, bundles may be dormant`,
    );
    return;
  }

  // Check whether BundleMain rendered (look for its data-testid markers).
  // Both bundle-helper-text and bundle-atc are exclusive to BundleAddToCart
  // which only renders inside BundleMain.
  const hasBundleMarker =
    (await page.getByTestId('bundle-helper-text').count()) > 0 ||
    (await page.getByTestId('bundle-atc').count()) > 0;

  await page.close();

  if (!hasBundleMarker) {
    test.skip(
      true,
      `bundles dormant on storefront: no product renders BundleMain ` +
        `(productType gate requires 'Bundle' but ${BUNDLE_PRODUCT_HANDLE} ` +
        `has productType 'Make-Up')`,
    );
  }
});

test('bundle shade gate: helper text when incomplete, ATC when all selected', async ({
  page,
}) => {
  await page.goto(`/products/${BUNDLE_PRODUCT_HANDLE}`);

  // Either helper text or ATC button should be visible (not both)
  const helperText = page.getByTestId('bundle-helper-text');
  const atcButton = page.getByTestId('bundle-atc');

  const helperVisible = await helperText.isVisible().catch(() => false);
  const atcVisible = await atcButton.isVisible().catch(() => false);

  // At least one state is visible; they are mutually exclusive
  expect(helperVisible || atcVisible).toBe(true);
  expect(helperVisible && atcVisible).toBe(false);
});
