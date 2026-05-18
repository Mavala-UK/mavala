import {test, expect} from '@playwright/test';

const ROUTES = [
  {path: '/', label: 'homepage', minBytes: 100000, expectedText: 'Mavala'},
  {path: '/products/mini-color-pink', label: 'PDP', minBytes: 200000, expectedText: 'Mini Color'},
  {path: '/collections/best-sellers', label: 'collection', minBytes: 80000, expectedText: 'Bestsellers'},
  {path: '/pages/the-brand', label: 'page', minBytes: 80000, expectedText: 'Mavala'},
];

for (const {path, label, minBytes, expectedText} of ROUTES) {
  test(`SSR emits body content on ${label} (${path})`, async ({page}) => {
    const response = await page.goto(path, {timeout: 20000});
    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content.length).toBeGreaterThan(minBytes);

    await expect(page.locator('body')).toContainText(expectedText, {timeout: 15000});
  });
}
