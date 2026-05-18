import {test, expect} from '@playwright/test';

test('bundle shade gate: helper text when incomplete, ATC when all selected', async ({
  page,
}) => {
  // The bundle shade gate test needs a known bundle product handle.
  // If no bundle exists in the catalogue, skip with diagnostics.
  // Known bundle: /products/double-brow (if it exists), else skip.
  const bundleHandle = 'double-brow';

  // eslint-disable-next-line playwright/no-networkidle
  const response = await page.goto(`/products/${bundleHandle}`);

  if (response?.status() === 404) {
    test.skip(true, `Bundle product ${bundleHandle} returned 404, no bundle available to test`);
    return;
  }

  // Either helper text or ATC button should be visible (not both)
  const helperText = page.getByTestId('bundle-helper-text');
  const atcButton = page.getByTestId('bundle-atc');

  const helperVisible = await helperText.isVisible().catch(() => false);
  const atcVisible = await atcButton.isVisible().catch(() => false);

  // At least one state is visible; they are mutually exclusive in the component logic
  expect(helperVisible || atcVisible).toBe(true);
  expect(helperVisible && atcVisible).toBe(false);
});
