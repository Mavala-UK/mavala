import {test, expect} from '@playwright/test';

// Third-party errors we cannot control and should not fail on
const ALLOWED_ERROR_PATTERNS = [
  'Yotpo',
  'TripleWhale',
  'google_tag_manager',
  'sdk.js',
  'axept',
];

test('homepage loads with no uncaught errors from our code', async ({page}) => {
  const pageErrors: Error[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error);
  });

  await page.goto('/');
  await page.waitForTimeout(2000);

  const ourErrors = pageErrors.filter((err) => {
    const msg = err.message || '';
    return !ALLOWED_ERROR_PATTERNS.some((pattern) =>
      msg.toLowerCase().includes(pattern.toLowerCase()),
    );
  });

  expect(ourErrors).toHaveLength(0);
});
