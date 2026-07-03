# Bundle PDP Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship three small, independent bundle PDP fixes from Carrie's 2026-05-12 corrections email — accordion icons, hide-reviews-when-empty, and hide-shade-button-until-ready — each through the four-stage deploy pipeline.

**Architecture:** Three feature branches off `dev`, each touching 1-3 files. No new runtime dependencies, no schema changes, no test infrastructure changes. Implementation is pure React/TypeScript with the project's existing CSS Modules and Hydrogen patterns.

**Tech Stack:** React Router v7, Shopify Hydrogen 2025.5.0, TypeScript, CSS Modules, react-intl, Lucide SVG paths (copied as React components, no package install).

**Verification approach:** This project has no automated test framework. Verification is the manual checklist in `CLAUDE.md` (Level 1: happy path / edge cases / error states / mobile / console / network; Level 2: confirm change visible in deployed page source). Walk it at every gate.

**Implementation stops at Stage 3 (dev preview).** Merging dev → master is Tim's call after he's seen all three on the dev preview URL.

---

## File Structure

| File | Action | Purpose |
|---|---|---|
| `app/components/icons/accordion/Layers.tsx` | Create | "Featuring" prefix icon |
| `app/components/icons/accordion/Atom.tsx` | Create | "Expert Care" prefix icon |
| `app/components/icons/accordion/Timer.tsx` | Create | "Ritual" prefix icon |
| `app/components/icons/accordion/Sparkles.tsx` | Create | "Expert Tip" prefix icon |
| `app/components/icons/accordion/FlaskConical.tsx` | Create | "Ingredients" prefix icon |
| `app/components/icons/accordion/Award.tsx` | Create | "Award Winning" prefix icon |
| `app/components/icons/accordion/index.ts` | Create | Export barrel + `getAccordionIcon(title)` helper |
| `app/components/product/ProductAccordion.tsx` | Modify | Render icon left of trigger text |
| `app/components/product/ProductAccordion.module.css` | Modify | Flex layout for icon + title |
| `app/components/product/ProductReviews.tsx` | Modify | Early return when no reviews |
| `app/components/product/ProductHeader.tsx` | Modify | Hide rating widget when no reviews |
| `app/components/bundle/BundleAddToCart.tsx` | Modify | Hide button until allSelected, show helper text |
| `app/components/bundle/BundleAddToCart.module.css` | Create or Modify | Helper text styling |

---

## Task 1: Branch hygiene baseline

**Files:** None (git state only)

- [ ] **Step 1: Confirm clean working tree on dev**

```bash
git status
git branch --show-current
```

Expected: branch is `dev`, no uncommitted changes. If you're on another branch with uncommitted changes from a previous task, stash or commit them first.

- [ ] **Step 2: Pull latest dev**

```bash
git pull origin dev
```

Expected: "Already up to date" or a fast-forward. No merge conflicts.

---

## Task 2 (Piece 1): Create accordion icon components

**Files:**
- Create: `app/components/icons/accordion/Layers.tsx`
- Create: `app/components/icons/accordion/Atom.tsx`
- Create: `app/components/icons/accordion/Timer.tsx`
- Create: `app/components/icons/accordion/Sparkles.tsx`
- Create: `app/components/icons/accordion/FlaskConical.tsx`
- Create: `app/components/icons/accordion/Award.tsx`

All icons follow the existing project pattern (see `app/components/icons/Plus.tsx`): a plain function component returning an inline SVG with `stroke="currentColor"` so they inherit colour from the parent. SVG paths are from Lucide (MIT-licensed), simplified to single-component form.

- [ ] **Step 1: Create branch**

```bash
git checkout -b feat/accordion-icons
```

- [ ] **Step 2: Write `Layers.tsx`**

```tsx
export function Layers() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.91a1 1 0 0 0 0-1.83Z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </svg>
  );
}
```

- [ ] **Step 3: Write `Atom.tsx`**

```tsx
export function Atom() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="1" />
      <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
      <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
    </svg>
  );
}
```

- [ ] **Step 4: Write `Timer.tsx`**

```tsx
export function Timer() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="10" x2="14" y1="2" y2="2" />
      <line x1="12" x2="15" y1="14" y2="11" />
      <circle cx="12" cy="14" r="8" />
    </svg>
  );
}
```

- [ ] **Step 5: Write `Sparkles.tsx`**

```tsx
export function Sparkles() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}
```

- [ ] **Step 6: Write `FlaskConical.tsx`**

```tsx
export function FlaskConical() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
      <path d="M6.453 15h11.094" />
      <path d="M8.5 2h7" />
    </svg>
  );
}
```

- [ ] **Step 7: Write `Award.tsx`**

```tsx
export function Award() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  );
}
```

- [ ] **Step 8: Write `index.ts` barrel + helper**

```ts
import type {ReactNode} from 'react';
import {Layers} from './Layers';
import {Atom} from './Atom';
import {Timer} from './Timer';
import {Sparkles} from './Sparkles';
import {FlaskConical} from './FlaskConical';
import {Award} from './Award';

const PREFIX_TO_ICON: ReadonlyArray<readonly [string, () => ReactNode]> = [
  ['award winning', Award],
  ['expert care', Atom],
  ['expert tip', Sparkles],
  ['featuring', Layers],
  ['ingredients', FlaskConical],
  ['ritual', Timer],
];

export function getAccordionIcon(title: string | null | undefined): ReactNode | null {
  if (!title) return null;
  const normalised = title.trim().toLowerCase();
  for (const [prefix, Icon] of PREFIX_TO_ICON) {
    if (normalised.startsWith(prefix)) return <Icon />;
  }
  return null;
}
```

Note: the prefix list is ordered with longer/more-specific prefixes first only where ambiguity could arise (none here — `Expert Care` and `Expert Tip` are both length-checked because each unique prefix is the full opening phrase).

- [ ] **Step 9: Commit icon library**

```bash
git add app/components/icons/accordion/
git commit -m "feat: add accordion icon set and prefix mapper"
```

---

## Task 3 (Piece 1): Wire icons into ProductAccordion

**Files:**
- Modify: `app/components/product/ProductAccordion.tsx`
- Modify: `app/components/product/ProductAccordion.module.css`

- [ ] **Step 1: Read current ProductAccordion.module.css to understand existing trigger styling**

```bash
cat app/components/product/ProductAccordion.module.css
```

Expected: a `.root` class plus trigger/content styling. Note the trigger's font size and padding so the icon sizing matches visually.

- [ ] **Step 2: Add icon container class to ProductAccordion.module.css**

Append:

```css
.trigger-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  flex-shrink: 0;
  width: 1.25em;
  height: 1.25em;
  color: var(--color-primary, currentColor);
}
```

The `--color-primary` token (Mavala brand red) gives the icon Carrie's intended red look; if undefined it falls back to currentColor so trigger text colour wins.

- [ ] **Step 3: Modify `ProductAccordion.tsx` to render the icon**

Replace the import block and the `AccordionTrigger` block.

Current import block (top of file):

```ts
import {cn, slugify} from '~/lib/utils';
import {useProductView} from './ProductView';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '../ui/Accordion';
import {Text} from '../ui/Text';
import {RichText} from '../common/RichText';
import styles from './ProductAccordion.module.css';
```

Add one import line after the `Text` import:

```ts
import {getAccordionIcon} from '../icons/accordion';
```

Current map body in the `accordions?.map(...)` callback:

```tsx
      {accordions?.map((accordion) => {
        const {title, text} = accordion ?? {};

        return (
```

Add an `icon` constant just below the `title, text` destructure:

```tsx
      {accordions?.map((accordion) => {
        const {title, text} = accordion ?? {};
        const icon = getAccordionIcon(title?.value);

        return (
```

Then replace the existing `AccordionTrigger` line:

```tsx
                <AccordionTrigger>{title?.value}</AccordionTrigger>
```

With:

```tsx
                <AccordionTrigger>
                  <span className={styles['trigger-inner']}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    {title?.value}
                  </span>
                </AccordionTrigger>
```

- [ ] **Step 4: Typecheck**

```bash
pnpm typecheck
```

Expected: no errors. If there are unrelated errors from elsewhere in the codebase that pre-existed, note them but don't fix them in this branch.

- [ ] **Step 5: Run local dev and verify**

```bash
pnpm dev
```

Walk these in a browser at `http://localhost:3000`:

1. Navigate to a bundle: `/products/mavala-home-spa-for-feet` (or whichever bundle is live).
2. Expand each accordion. Verify icons render for: Featuring, Expert Care, Ritual, Expert Tip, Ingredients, Award Winning prefixes.
3. Navigate to a non-bundle product with at least one accordion (e.g. `/products/perfect-concealer`). Confirm if its accordion title matches a prefix it gets an icon; if not, no icon and no broken layout.
4. Resize to 375px. Confirm icons don't push the title onto multiple lines awkwardly.
5. Open DevTools console. Confirm no red errors caused by this change.

If any prefix doesn't match because the Shopify content has different capitalisation or extra leading whitespace, the helper handles it (`.trim().toLowerCase()`).

- [ ] **Step 6: Commit**

```bash
git add app/components/product/ProductAccordion.tsx app/components/product/ProductAccordion.module.css
git commit -m "feat: render icon next to accordion title based on prefix"
```

---

## Task 4 (Piece 1): Push and verify on feature preview

**Files:** None

- [ ] **Step 1: Push branch**

```bash
git push -u origin feat/accordion-icons
```

- [ ] **Step 2: Wait for and verify the deploy**

```bash
curl -s https://api.github.com/repos/Mavala-UK/mavala/actions/runs?per_page=5 \
  | python3 -c "import json,sys; [print(f\"{r['head_branch']:30s} {r['status']:12s} {r['conclusion']}\") for r in json.load(sys.stdin)['workflow_runs'][:5]]"
```

Re-run every 30-60 seconds until `feat/accordion-icons` shows `completed success`. Expected wait: 2-3 minutes.

- [ ] **Step 3: Find the preview URL**

```bash
RUN_ID=$(curl -s https://api.github.com/repos/Mavala-UK/mavala/actions/runs?per_page=10 \
  | python3 -c "import json,sys; runs=[r for r in json.load(sys.stdin)['workflow_runs'] if r['head_branch']=='feat/accordion-icons']; print(runs[0]['id'] if runs else 'NOT FOUND')")
echo "Run ID: $RUN_ID"

gh api "repos/Mavala-UK/mavala/actions/runs/$RUN_ID/logs" \
  | python3 -c "
import sys, zipfile, io
z = zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read()))
for f in z.namelist():
    for line in z.open(f).read().decode('utf-8', errors='replace').split('\n'):
        if 'myshopify.dev' in line:
            print(line)
"
```

Capture the `.myshopify.dev` URL from the output.

- [ ] **Step 4: Verify the change is on the preview URL**

```bash
PREVIEW_URL="<paste the URL from Step 3>"
curl -sL "$PREVIEW_URL/products/mavala-home-spa-for-feet" | grep -c "trigger-inner"
```

Expected: a non-zero count. If zero, the CSS module class hash may be different — instead grep for one of the icon paths e.g.:

```bash
curl -sL "$PREVIEW_URL/products/mavala-home-spa-for-feet" | grep -c "M14 2v6a2 2"
```

Expected: at least 1 (the FlaskConical path appears if "Ingredients" accordion is present).

- [ ] **Step 5: Browser verification**

Open the preview URL in a browser. Walk through the same checklist as the local verification (Task 3 Step 5). Add: on a bundle PDP, confirm at least 3 different icons render (different prefixes).

---

## Task 5 (Piece 2): Hide reviews when empty

**Files:**
- Modify: `app/components/product/ProductReviews.tsx`
- Modify: `app/components/product/ProductHeader.tsx`

- [ ] **Step 1: Create branch from dev**

```bash
git checkout dev
git pull origin dev
git checkout -b feat/hide-empty-reviews
```

- [ ] **Step 2: Modify `ProductReviews.tsx`**

After this line:

```tsx
  const {bottomline, reviews} = yotpoReviews ?? {};
```

Add:

```tsx
  if (!bottomline?.total_review) return null;
```

This is the only edit to `ProductReviews.tsx`.

- [ ] **Step 3: Modify `ProductHeader.tsx`**

Current rating block (around line 37-49):

```tsx
      {!isMavalaCorporate && (
        <Text size="sm" className={capacity ? styles.right : styles.left}>
          <StarBold />
          <Link to={`#reviews`}>
            {bottomline?.average_score} - {bottomline?.total_review}{' '}
            {` ${formatMessage({id: 'reviews'})}`}
          </Link>
        </Text>
      )}
```

Replace with:

```tsx
      {!isMavalaCorporate && bottomline?.total_review ? (
        <Text size="sm" className={capacity ? styles.right : styles.left}>
          <StarBold />
          <Link to={`#reviews`}>
            {bottomline?.average_score} - {bottomline?.total_review}{' '}
            {` ${formatMessage({id: 'reviews'})}`}
          </Link>
        </Text>
      ) : null}
```

- [ ] **Step 4: Typecheck**

```bash
pnpm typecheck
```

Expected: no new errors.

- [ ] **Step 5: Local verification**

```bash
pnpm dev
```

Walk:

1. Find a product without Yotpo reviews. Use the Storefront API debugging memory if needed, but easier: pick any product Carrie hasn't added reviews to. Try `/products/mini-color-pink`.
2. Confirm the Reviews section is absent (no title, no zero-state card).
3. Confirm the header rating widget (the star + "0 - 0 reviews" link) is absent.
4. Find a product **with** reviews. Confirm both the rating widget and Reviews section still render.
5. Open DevTools console. Confirm no red errors caused by this change.

- [ ] **Step 6: Commit**

```bash
git add app/components/product/ProductReviews.tsx app/components/product/ProductHeader.tsx
git commit -m "feat: hide reviews section and rating widget when no reviews"
```

- [ ] **Step 7: Push and verify preview**

```bash
git push -u origin feat/hide-empty-reviews
```

Use the same wait/verify pattern as Task 4 (Steps 2-5), substituting branch name. For verification on the preview URL, find a no-review product and a with-review product, confirm both behaviours.

---

## Task 6 (Piece 3): Shade button hide-until-ready

**Files:**
- Modify: `app/components/bundle/BundleAddToCart.tsx`
- Create: `app/components/bundle/BundleAddToCart.module.css`

- [ ] **Step 1: Create branch from dev**

```bash
git checkout dev
git pull origin dev
git checkout -b feat/bundle-shade-button
```

- [ ] **Step 2: Check whether BundleAddToCart.module.css already exists**

```bash
ls app/components/bundle/BundleAddToCart.module.css 2>/dev/null
```

If it exists, you'll modify it; if not, create it.

- [ ] **Step 3: Write or extend `BundleAddToCart.module.css`**

Set the file contents to:

```css
.helper {
  display: block;
  text-align: center;
  padding: 1rem 0;
  color: var(--color-text-muted, #6b6b6b);
}
```

If the file already exists with other styles, append the `.helper` rule, do not overwrite existing rules.

- [ ] **Step 4: Replace `BundleAddToCart.tsx` contents**

Set the file contents to:

```tsx
import {CartForm} from '@shopify/hydrogen';
import {FormattedMessage} from 'react-intl';
import {useBundleContext} from './BundleContext';
import {useCartDrawer} from '../cart/CartDrawer';
import {Button, ButtonEffect} from '../ui/Button';
import {ProductPrice} from '../product/ProductPrice';
import {Text} from '../ui/Text';
import type {ProductItemFragment} from 'storefrontapi.generated';
import styles from './BundleAddToCart.module.css';

export function BundleAddToCart({
  components,
}: {
  components: ProductItemFragment[];
}) {
  const {bundleProduct, selectedVariants} = useBundleContext();
  const {setIsCartDrawerOpen} = useCartDrawer();

  const bundleVariant = bundleProduct.selectedVariant ?? bundleProduct.variants.nodes[0];

  const allSelected = components.every(
    (c) => !!selectedVariants[c.handle],
  );

  if (!allSelected || !bundleVariant) {
    return (
      <Text size="sm" className={styles.helper}>
        <FormattedMessage
          id="bundle_pick_shade_helper"
          defaultMessage="Pick a shade for each item to add to cart."
        />
      </Text>
    );
  }

  const lines = [
    {
      merchandiseId: bundleVariant.id,
      quantity: 1,
      attributes: components.flatMap((component, i) => [
        {
          key: `_component_${i + 1}`,
          value: selectedVariants[component.handle]?.id ?? '',
        },
        {
          key: component.title,
          value: selectedVariants[component.handle]?.title ?? '',
        },
      ]),
    },
  ];

  const handleClick = () => {
    setIsCartDrawerOpen(true);
  };

  return (
    <CartForm
      route="/resource/cart"
      inputs={{lines}}
      action={CartForm.ACTIONS.LinesAdd}
    >
      <Button type="submit" onClick={handleClick}>
        <ButtonEffect>
          <FormattedMessage id="add" />
          <ProductPrice
            price={bundleVariant.price}
            compareAtPrice={bundleVariant.compareAtPrice}
          />
        </ButtonEffect>
      </Button>
    </CartForm>
  );
}
```

Notes on the diff vs current file:
- The `CartForm` is no longer mounted when shades aren't selected. This is safe because there's no in-flight form to interrupt — selection state lives in React, not in form state.
- The disabled button branch is gone entirely. Helper text replaces it.
- The success branch (allSelected) drops the conditional inside the button (was needed for the dual-state button; now redundant).

- [ ] **Step 5: Typecheck**

```bash
pnpm typecheck
```

Expected: no new errors.

- [ ] **Step 6: Local verification**

```bash
pnpm dev
```

Walk:

1. Navigate to a bundle: `/products/mavala-home-spa-for-feet`.
2. Confirm on fresh load (no `?Shade=…` params) there's no add-to-cart button; instead the helper text "Pick a shade for each item to add to cart." sits below the components.
3. Pick a shade for the first component. Confirm the helper text remains (still missing other shades).
4. Pick shades for all components. Confirm the helper text is replaced by the add-to-cart button with the correct bundle price and compare-at price.
5. Unselect or change one shade (navigate back, then forward to remove). Confirm button disappears, helper text returns.
6. With all shades selected, click the button. Confirm cart drawer opens and the bundle lands in the cart with each shade attribute attached. Open `/cart`, confirm the line items.
7. Resize to 375px. Confirm the helper text and the button both look OK.
8. Open DevTools console. No red errors.
9. Network tab. The `/resource/cart` POST should fire on click; check it returns 200.

- [ ] **Step 7: Commit**

```bash
git add app/components/bundle/BundleAddToCart.tsx app/components/bundle/BundleAddToCart.module.css
git commit -m "feat: hide bundle add-to-cart button until all shades selected"
```

- [ ] **Step 8: Push and verify preview**

```bash
git push -u origin feat/bundle-shade-button
```

Same wait/verify pattern as Task 4 (Steps 2-5). For verification: on the preview URL, walk the same cart flow from local Step 6, paying particular attention to the cart submission roundtrip (the preview URL hits the real Shopify cart API).

---

## Task 7: Merge all three to dev and integration-verify

**Files:** None

- [ ] **Step 1: Merge accordion-icons to dev**

```bash
git checkout dev
git pull origin dev
git merge --no-ff feat/accordion-icons
git push origin dev
```

The `--no-ff` is optional but keeps the feature-branch boundary visible in history.

- [ ] **Step 2: Wait for dev deploy**

```bash
curl -s https://api.github.com/repos/Mavala-UK/mavala/actions/runs?per_page=5 \
  | python3 -c "import json,sys; [print(f\"{r['head_branch']:30s} {r['status']:12s} {r['conclusion']}\") for r in json.load(sys.stdin)['workflow_runs'][:5]]"
```

Re-run until `dev` shows `completed success`.

- [ ] **Step 3: Verify on dev preview URL**

Find the dev preview URL using the same log-extraction technique as Task 4 Step 3 (branch name `dev`). Walk the verification checklist for Piece 1 again.

- [ ] **Step 4: Merge hide-empty-reviews to dev**

```bash
git merge --no-ff feat/hide-empty-reviews
git push origin dev
```

- [ ] **Step 5: Wait, then verify on dev preview**

Same pattern. Walk Piece 2's verification checklist.

- [ ] **Step 6: Merge bundle-shade-button to dev**

```bash
git merge --no-ff feat/bundle-shade-button
git push origin dev
```

- [ ] **Step 7: Wait, then verify on dev preview**

Same pattern. Walk Piece 3's verification checklist. Critically: walk the full add-to-cart flow on the dev preview URL.

- [ ] **Step 8: Final integration check**

On the dev preview URL, pick a bundle product. Confirm all three pieces work together:
- Accordions on the bundle PDP show icons (Piece 1)
- The reviews section is absent if the bundle has no Yotpo reviews (Piece 2)
- The add-to-cart button is hidden until all shades are picked (Piece 3)

If any piece regressed, do not merge to master. Investigate, fix, re-verify.

---

## Task 8: Hand-off

**Files:** None

- [ ] **Step 1: Summarise the state for Tim**

Write a short note (in the chat, not a file) covering:
- What was shipped to dev (the three pieces)
- The dev preview URL Tim and Carrie can visit
- Any deferred items or follow-ups (e.g. Carrie may still want to swap the icons later; the badge colour change is parked)

- [ ] **Step 2: Wait for Tim's sign-off before merging dev → master**

The production merge is not part of this plan. Tim makes that call after seeing all three on the dev preview.

- [ ] **Step 3: Branch cleanup (after Tim ships to master)**

```bash
git branch -d feat/accordion-icons
git branch -d feat/hide-empty-reviews
git branch -d feat/bundle-shade-button
git push origin --delete feat/accordion-icons
git push origin --delete feat/hide-empty-reviews
git push origin --delete feat/bundle-shade-button
```

Do NOT run this step until Tim has merged dev to master.

---

## Self-Review Notes

**Spec coverage:**
- Piece 1 (accordion icons): Tasks 2-4
- Piece 2 (hide empty reviews): Task 5
- Piece 3 (shade button): Task 6
- Integration: Task 7
- All three pieces have a verification step at local, feature-preview, and dev-preview stages.

**Out-of-scope items from the spec (confirmed not in plan):**
- Badge colour `#A22034`: parked, not in plan
- Step-by-step physical guide: parked
- Bundle copy population: content work, not in plan

**Risks:**
- Lucide SVG paths may need tweaking if they render too thick or too small on small screens. The `1.25em` size in CSS gives them room to scale with surrounding text. If Carrie dislikes them visually we swap individual icon components, one-line change per icon.
- The cart `<CartForm>` mount/unmount on `allSelected` flip is the riskiest change. Verified during Task 6 Step 6 by exercising the full cart roundtrip.
