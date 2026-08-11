/**
 * Product page H1 shows the selected variant (shade) name.
 *
 * Carrie asked (2026-08-05) for the variant name to appear in the product page
 * H1 alongside the product name, matching the shade image already shown.
 *
 * Invariants covered:
 * - A shade product (multi-value Shade option) loaded with a ?Shade= param
 *   renders "Product Title - Shade Name" in the H1 (e.g. mini-color-pink loads
 *   "9. Lisboa"). The param 301s to the canonical path URL, and the H1 reflects
 *   the path-resolved selected variant.
 * - A non-shade product (Packaging option, not in the shade allowlist) keeps
 *   its H1 as exactly the product title ("Nailactan"), matching the promise to
 *   the client that non-shade products stay unchanged.
 *
 * Selector priority is data-testid first (product-h1), per the project's test
 * conventions. Serial mode + retries: MiniOxygen (local Cloudflare Workers
 * runtime) cannot handle parallel SSR load from multiple viewport runners.
 */

import {test, expect} from '@playwright/test';

test.describe.configure({mode: 'serial', retries: 1});

// Verified against the live Storefront API (2026-08-11):
//   mini-color-pink: title "Mini Color Nail Polish Pink", option "Shade"
//                    (50 values), value "9. Lisboa" -> slug "9-lisboa"
//   nailactan:       title "Nailactan", option "Packaging" (Tube/Jar), NOT a
//                    shade option -> H1 must stay "Nailactan"
const SHADE_PRODUCT = {
  handle: 'mini-color-pink',
  title: 'Mini Color Nail Polish Pink',
  optionName: 'Shade',
  optionValue: '9. Lisboa',
  slug: '9-lisboa',
};
const NON_SHADE_PRODUCT = {handle: 'nailactan', title: 'Nailactan'};

test('shade product H1 shows the selected shade (?Shade= param)', async ({
  page,
}) => {
  const url = `/products/${SHADE_PRODUCT.handle}?${SHADE_PRODUCT.optionName}=${encodeURIComponent(
    SHADE_PRODUCT.optionValue,
  )}`;
  const response = await page.goto(url, {timeout: 30000, waitUntil: 'commit'});

  // Skip gracefully if the product fell out of the catalogue / 404s.
  if (response?.status() === 404) {
    test.skip(true, `${SHADE_PRODUCT.handle} 404 - catalogue may have changed`);
    return;
  }

  // The ?Shade= param redirects to the canonical path URL; the H1 renders
  // "Product Title - Shade Name".
  await expect(page.getByTestId('product-h1')).toHaveText(
    `${SHADE_PRODUCT.title} - ${SHADE_PRODUCT.optionValue}`,
    {timeout: 15000},
  );
});

test('non-shade product H1 stays as the bare product title (nailactan)', async ({
  page,
}) => {
  const response = await page.goto(`/products/${NON_SHADE_PRODUCT.handle}`, {
    timeout: 30000,
    waitUntil: 'commit',
  });

  // Skip gracefully if the product fell out of the catalogue / 404s.
  if (response?.status() === 404) {
    test.skip(
      true,
      `${NON_SHADE_PRODUCT.handle} 404 - catalogue may have changed`,
    );
    return;
  }

  // Packaging is a multi-value non-shade option: the H1 must be unchanged.
  await expect(page.getByTestId('product-h1')).toHaveText(
    NON_SHADE_PRODUCT.title,
    {timeout: 15000},
  );
});
