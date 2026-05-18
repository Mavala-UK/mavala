import {test, expect} from '@playwright/test';

test('cart drawer trigger is present in the DOM', async ({page}) => {
  await page.goto('/');

  // Sprint 1B: SSR-safe cart shell renders even before hydration.
  // The cart drawer trigger (both fallback and content variants) should
  // be in the DOM on initial page load.
  const trigger = page.getByTestId('cart-drawer-trigger');
  await expect(trigger).toBeAttached({timeout: 10000});
});
