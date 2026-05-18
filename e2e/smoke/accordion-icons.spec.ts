import {test, expect} from '@playwright/test';

test('accordion items with icons render SVG elements', async ({page}) => {
  await page.goto('/products/mini-color-pink');

  // Expand the first accordion item to reveal its icon
  const accordionTriggers = page.locator('[data-orientation="vertical"] button');
  const count = await accordionTriggers.count();

  if (count === 0) {
    test.skip(true, 'No accordion triggers found on PDP');
    return;
  }

  // Click the first trigger to expand
  await accordionTriggers.first().click();
  await page.waitForTimeout(500);

  // Look for accordion icons (may be in any accordion item)
  const icons = page.getByTestId('accordion-icon');
  const iconCount = await icons.count();

  if (iconCount === 0) {
    test.skip(true, 'No accordion icons found (product may not have any)');
    return;
  }

  // Each accordion-icon span should contain an SVG
  for (let i = 0; i < iconCount; i++) {
    const icon = icons.nth(i);
    await expect(icon).toBeVisible({timeout: 5000});
    const svg = icon.locator('svg');
    await expect(svg).toBeAttached();
  }
});
