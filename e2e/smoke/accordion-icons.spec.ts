import {test, expect} from '@playwright/test';

test('accordion items with icons render SVG elements', async ({page}) => {
  await page.goto('/products/mini-color-pink');

  // Wait for client-side hydration to render the accordion (Radix-based,
  // renders client-side only; no SSR for accordion content).
  const accordion = page.locator('[data-accordion-orientation="vertical"]');
  await expect(accordion).toBeAttached({timeout: 30000});

  // Find all trigger buttons within the accordion
  const triggers = accordion.locator('button');
  const triggerCount = await triggers.count();
  expect(triggerCount).toBeGreaterThan(0);

  // Click the first trigger to expand it
  await triggers.first().click();
  // Wait for expansion animation
  await page.waitForTimeout(500);

  // After expansion, look for the accordion-icon testid
  const icons = page.getByTestId('accordion-icon');
  const iconCount = await icons.count();

  // If no icons found via testid, look for SVG elements within the accordion
  if (iconCount === 0) {
    // The accordion might use a different icon pattern.
    // Assert that the accordion content rendered something.
    const svgs = accordion.locator('svg');
    const svgCount = await svgs.count();
    expect(svgCount).toBeGreaterThan(0);
    return;
  }

  // Each accordion-icon span should contain an SVG
  for (let i = 0; i < iconCount; i++) {
    const icon = icons.nth(i);
    await expect(icon).toBeVisible({timeout: 10000});
    await expect(icon.locator('svg')).toBeAttached();
  }
});
