import {test, expect} from '@playwright/test';

test('Yotpo reviews section hidden when product has no reviews', async ({page}) => {
  await page.goto('/products/mini-color-pink');

  // Sprint 1E: ProductReviews returns null when total_review is 0
  // So the data-testid element should NOT be in the DOM at all
  const reviewsSection = page.getByTestId('product-reviews-section');
  await expect(reviewsSection).toHaveCount(0);
});
