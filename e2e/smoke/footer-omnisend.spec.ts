import {test, expect} from '@playwright/test';

test('Omnisend embed div renders in footer', async ({page}) => {
  await page.goto('/');

  // The Omnisend div is an empty placeholder -- Omnisend JS injects the
  // form only after hydration. Assert it is in the DOM (attached), not
  // that it is visible (empty divs have zero dimensions).
  const embed = page.getByTestId('omnisend-embed');
  await expect(embed).toBeAttached();
  await expect(embed).toHaveId(
    'omnisend-embedded-v2-6a0afe5bd1194eac97043333',
  );
});
