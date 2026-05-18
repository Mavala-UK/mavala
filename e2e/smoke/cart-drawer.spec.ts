import {test, expect} from '@playwright/test';

test('cart drawer trigger opens cart drawer', async ({page}) => {
  await page.goto('/');

  const trigger = page.getByTestId('cart-drawer-trigger');
  await expect(trigger).toBeVisible();

  await trigger.click();

  const dialog = page.getByTestId('cart-drawer-dialog');
  await expect(dialog).toBeVisible({timeout: 5000});
});
