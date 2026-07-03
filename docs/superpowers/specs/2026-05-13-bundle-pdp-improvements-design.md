# Bundle PDP improvements

Three small, independent fixes to the bundle (and product) detail page, based on Carrie's 2026-05-12 corrections email. Each piece ships as its own feature branch through the four-stage pipeline.

## Piece 1: Accordion icons

### What

The `custom.accordions` metaobject items (Featuring, Expert Care, Ritual, Expert Tip, Ingredients, Award Winning) currently render as plain text inside `<AccordionTrigger>`. Carrie wants an icon in front of each, picked by the title's leading word(s).

### Where

`app/components/product/ProductAccordion.tsx:42-60` — the only render site. The bundle page reuses this same component via `BundleMain.tsx:120`.

### How

1. Add a new directory `app/components/icons/accordion/` containing one React component per icon. Sourced from the Lucide icon set (MIT-licensed). The project already hand-rolls SVG components under `app/components/icons/` so this matches existing convention. No new dependency.

   | Prefix (case-insensitive) | Icon | Lucide name |
   |---|---|---|
   | `Featuring` | Stacked rectangles | `Layers` |
   | `Expert Care` | Atom/molecule | `Atom` |
   | `Ritual` | Clock with second hand | `Timer` |
   | `Expert Tip` | Sparkle | `Sparkles` |
   | `Ingredients` | Erlenmeyer flask | `FlaskConical` |
   | `Award Winning` | Ribbon medal | `Award` |

2. Add a `getAccordionIcon(title: string): ReactNode | null` helper. Case-insensitive `startsWith` against each prefix in order. Returns the icon component or `null` if no match.

3. Update `ProductAccordion.tsx` to render the icon left of the title inside the trigger. Layout: flex row, small gap, icon `1em` square, inheriting `currentColor` so it adopts the Mavala brand red where the trigger text does.

4. Titles that don't match any prefix render with no icon. No visual gap reserved (no empty placeholder); the title sits where it does today.

### Non-goals

- Configurable mapping via Sanity or Shopify metafield. The mapping lives in code so it's reviewable and consistent across the catalogue. If Carrie adds a new prefix later, it's a small PR.
- Animation, hover state changes for the icon itself.

### Risk

Low. Pure additive render change. If the helper throws, accordion still renders (defensive: wrap in try/catch isn't needed since `startsWith` on a string is safe).

---

## Piece 2: Hide reviews section when empty

### What

The reviews section on the bundle PDP renders an empty shell when Yotpo has no reviews for the product (title, "0 reviews" link, no review cards). Carrie wants the whole section gone in that case. The rating widget in the product header (which links to `#reviews`) should also be hidden, otherwise the link points to nothing.

### Where

- `app/components/product/ProductReviews.tsx:15` — the section component
- `app/components/product/ProductHeader.tsx:23-50` — the header rating widget

### How

In both components, read `bottomline?.total_review` from the loader's `yotpoReviews`. Return `null` (or skip the rating block) when it's `0`, `undefined`, or `null`.

```ts
// ProductReviews.tsx, early in the function body
if (!bottomline?.total_review) return null;
```

```tsx
// ProductHeader.tsx, around the rating block
{bottomline?.total_review ? (
  <div className={styles.rating}>...</div>
) : null}
```

### Non-goals

- Loading state handling. Yotpo data is in `loadCriticalData` (awaited), so the loader either has it or it's failed. No "loading reviews..." flicker is possible.
- Showing a "Be the first to review" CTA. Carrie didn't ask for one. Out of scope.

### Risk

Low. If Yotpo's response shape changes, the falsy check still does the right thing (hides the section).

---

## Piece 3: Shade selector button — hide until ready

### What

Today, a permanently-visible disabled grey button reading "SELECT ALL SHADES" sits above the cart area on bundle pages. Carrie finds this confusing because it looks like a CTA but does nothing. She wants the button hidden until every component has a chosen shade, then the add-to-cart button appears. A small helper line sits in the button's place beforehand.

### Where

`app/components/bundle/BundleAddToCart.tsx:55-67` — the only render site.

### How

1. Compute `allSelected` (already exists at line 23).
2. When `allSelected` is `false`, render the helper text (`<Text size="sm">` or similar, muted colour, in the same vertical space the button would occupy so the layout doesn't jump on selection).
3. When `allSelected` is `true`, render the existing `<Button>` with its existing add-to-cart payload.
4. Drop the `aria-disabled` / `disabled` toggle and the `"Select all shades"` `FormattedMessage` branch from inside the button.

### Copy

Helper text (English): **"Pick a shade for each item to add to cart."**

Add `bundle_pick_shade_helper` to the i18n message bundle. Use existing FR/EN translation flow — Carrie or Maria can edit the FR copy in Sanity if needed.

### Layout

The helper line occupies roughly the same height as the button (single line, similar padding). On state change to `allSelected = true`, the button replaces the text in place. Small CSS transition optional (out of scope unless trivially achievable with existing tokens).

### Risk

Medium-low. The bundle add-to-cart form must still render the `<CartForm>` element regardless of state, otherwise React Router's form submission breaks. Solution: keep `<CartForm>` mounted always, only switch the inner contents (text vs button). The existing structure already has this shape; just swap the conditional inside.

---

## Cross-cutting

### Sequencing

Three independent feature branches off `dev`. Order doesn't matter, but I'd suggest:

1. `feat/accordion-icons` — visible on every product page with accordions, biggest visual surface
2. `feat/hide-empty-reviews` — affects every product without reviews
3. `feat/bundle-shade-button` — affects only bundle pages

Each goes through the full Stage 1-4 pipeline with verification at each gate. Per project conventions, do not merge anything to `master` until `dev` is stable across all three.

### Testing

- **Piece 1:** Walk `/products/mavala-home-spa-for-feet` (a bundle with accordions) locally. Verify every prefix in the table renders its icon. Verify a non-matching title renders no icon and no broken layout.
- **Piece 2:** Find a product with zero reviews via the Storefront API (or a Yotpo direct query). Confirm the reviews section is absent and the header rating widget is absent. Then load a product with reviews to confirm nothing regressed.
- **Piece 3:** Load a bundle in fresh state (no `?Shade=` params). Confirm no button, helper text shown. Pick all shades. Confirm helper text disappears, add-to-cart button appears with correct price. Pick all minus one. Confirm button disappears again.

### Out of scope (deferred)

- **Badge colour change to `#A22034`** — Carrie says "for now is ok, will change in future." Park.
- **Step-by-step physical guide** — Maria's email mentioned this; it's a content/print item, not a website change.
- **Bundle copy (Featuring / How To Use / Ritual Tip)** — Carrie and Maria are populating these directly in Shopify Admin via the `custom.accordions` metaobject. No dev change needed.

### Not introducing

- New runtime dependencies
- New env vars
- Schema changes (Sanity, Shopify metafields)
- Changes to `loadCriticalData`/`loadDeferredData` shapes
