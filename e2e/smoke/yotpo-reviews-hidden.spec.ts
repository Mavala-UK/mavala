import {test, expect} from '@playwright/test';

test('Yotpo reviews section hidden when product has no reviews', async ({page}) => {
  await page.goto('/products/mini-color-pink');

  // Sprint 1E: ProductReviews returns null when total_review is 0.
  // The data-testid element should NOT be in the DOM at all.
  // Use toHaveCount(0) rather than toBeVisible/toBeAttached since
  // the element literally does not exist.
  await expect(page.getByTestId('product-reviews-section')).toHaveCount(0);
});
