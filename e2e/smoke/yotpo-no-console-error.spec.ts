import {test, expect} from '@playwright/test';

test('no Yotpo fetch error logged on PDP load', async ({page}) => {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto('/products/mini-color-pink');
  // Wait for any async fetches to settle
  await page.waitForTimeout(3000);

  const yotpoErrors = errors.filter((e) => e.includes('Error fetching Yotpo reviews'));
  expect(yotpoErrors).toHaveLength(0);
});
