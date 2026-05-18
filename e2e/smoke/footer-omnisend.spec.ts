import {test, expect} from '@playwright/test';

test('Omnisend embed div renders in footer', async ({page}) => {
  await page.goto('/');

  await expect(page.getByTestId('omnisend-embed')).toBeVisible();
  await expect(page.getByTestId('omnisend-embed')).toHaveId(
    'omnisend-embedded-v2-6a0afe5bd1194eac97043333',
  );
});
