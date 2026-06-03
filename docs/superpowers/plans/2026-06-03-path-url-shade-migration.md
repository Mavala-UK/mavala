# Path-URL Shade Migration Implementation Plan

> **For agentic workers:** Implement this plan task-by-task on the ISOLATED branch `feat/path-url-shade-migration`. Do NOT merge to dev or master at any point. Steps use checkbox (`- [ ]`) syntax. Each chunk is gated by architect (spec) + qa (verify) before the next starts.

**Goal:** Move PDP shade selection from query params (`?Teinte=Vert+Empire`) to path URLs (`/products/crayon-lumiere/vert-empire`) across all variant products, so each shade is independently indexable, the false out-of-stock on tracking-tagged links is gone, and old links 301 to the new ones.

**Architecture:** A new route segment `products.$handle.$shade.tsx` resolves a shade slug to a variant (option-name-agnostic across Teinte/Color/Shade/Shades/Teintes), renders the existing ProductMain tree, and sets a per-shade canonical. The existing product route 301-redirects any `?<OptionName>=<value>` shade query (and the `?variant=<id>` Merchant Center chain) to the path URL. The frontend reads the shade from the path-resolved variant, not from `useSearchParams`, which removes the tracking-param pollution that breaks the drawer Add-to-Cart button. Per-shade JSON-LD and sitemap entries follow.

**Tech Stack:** React Router v7 fs-routes, Shopify Hydrogen 2025.5.0, Storefront API `variantBySelectedOptions(ignoreUnknownOptions, caseInsensitiveMatch)`, Vitest (unit), Playwright (e2e), TypeScript, CSS Modules.

**Scope (locked with Tim 2026-06-03):** ALL variant products. FULL build (core + sitemap + per-shade structured data + full test matrix). Slugify shade labels AS-IS, numbers preserved ("9. Lisboa" -> `/9-lisboa`).

**Out of scope:** bundle products (separate picker, not query-param based); the option-name standardisation in Shopify Admin (the build is name-agnostic so it does not need it); shipping to dev/live (isolated branch only until client approval).

---

## Source-of-truth findings (from investigation, cite these while building)

- Canonical strips shade: `app/routes/_store.($locale).products.$handle.tsx:206-210` builds canonical as URL-up-to-last-slash + handle = always `/products/<handle>`. Proven: `?Teinte=Vert+Empire` and bare both emit identical `<link rel="canonical">`. THIS is why shades never index.
- Drawer OOS: `app/components/product/ProductVariants.tsx:84-90` useEffect maps ALL `searchParams.entries()` (incl utm/fbclid) into `selectedOptions`. `app/components/product/drawer/ProductViewDrawerContent.tsx:31-35` does `JSON.stringify(variant.selectedOptions) === JSON.stringify(selectedOptions)` exact match (no ignore-unknown) -> UTM noise breaks the match -> `selectedVariant=null` -> `AddToCartButton.tsx:133` renders out_of_stock. Main-page ATC is fine (uses resource route with `ignoreUnknownOptions:true`).
- Redirect-to-first-variant: `products.$handle.tsx:330-344` + `app/lib/utils.ts:80-96` `getVariantUrl` preserves tracking params in the 302 target.
- Existing `?variant=<id>` -> `?<OptionName>=` redirect: `products.$handle.tsx:66-112`.
- Option-name distribution (live): Teinte 15, Color 12, Shade 10, Shades 2, Teintes 1, Packaging 1, Title 114 (single-variant, no shade path). Single source of truth for the resolver: the product's OWN `options[].name`, never a hardcoded key.
- JSON-LD offers (per-variant, `?Shade=` format): `products.$handle.tsx:236-257`.
- Existing slugify: `app/lib/utils.ts:60-67` (lowercases, strips diacritics, spaces->hyphens). Reuse and harden for shade slugs.
- Crawlable-link gate: `ProductVariants.tsx:18` `SHADE_LINK_HANDLES = new Set(['mini-color-pink'])`; `ShadeOption.tsx:33-50` already renders a `<Link to={...}>` when `to` is defined.

---

## File structure

- Create: `app/routes/_store.($locale).products.$handle.$shade.tsx` (the shade route + loader)
- Create: `app/lib/shadeUrl.ts` (slug helpers: `slugifyShade`, `findVariantBySlug`, `getShadeOptionName`, `buildShadePath`) + co-located `app/lib/__tests__/shadeUrl.test.ts`
- Modify: `app/routes/_store.($locale).products.$handle.tsx` (301 redirects from query-shade + variant chain to path; canonical already per-shade once the path route owns it)
- Modify: `app/components/product/ProductVariants.tsx` (emit path links for ALL products, remove SHADE_LINK_HANDLES gate; stop polluting `selectedOptions` with non-option params)
- Modify: `app/components/product/drawer/ProductViewDrawerContent.tsx` (match the path-resolved variant, not the searchParams-derived options)
- Modify: `app/components/product/ProductView.tsx` / the ProductView context (accept an explicit path-resolved `selectedVariant` so the frontend does not depend on searchParams for the shade)
- Modify: `app/routes/_store.($locale).sitemap.$type.$page[.xml].tsx` (emit `/products/<handle>/<shade-slug>` entries)
- Modify: `app/lib/utils.ts` (harden `slugify` if needed; do NOT break existing callers)

---

## Chunk 0: Branch + baseline

- [ ] Create the worktree/branch `feat/path-url-shade-migration` from `dev`. Confirm `pnpm typecheck` + `pnpm test:unit` are green on the baseline before any change.
- [ ] Copy this plan to `docs/superpowers/plans/2026-06-03-path-url-shade-migration.md` on the branch and commit (`chore: add path-url shade migration plan`).

## Chunk 1: Slug helpers (pure, TDD, no UI)

**Files:** Create `app/lib/shadeUrl.ts` + `app/lib/__tests__/shadeUrl.test.ts`.

Interfaces to build (write tests FIRST for each):
- `slugifyShade(value: string): string` - "9. Lisboa" -> "9-lisboa", "Vert Empire" -> "vert-empire", "Vert Celeste" (accent) -> "vert-celeste". Reuse `slugify` from utils.ts; ADD: collapse repeated hyphens, trim leading/trailing hyphens, drop a trailing period. Test the numbered, accented, and space cases explicitly.
- `getShadeOptionName(product): string | null` - returns the product's single multi-value option name (Teinte/Color/Shade/Shades/Teintes) by reading `product.options` and finding the option with `values.length > 1`. Returns null for single-variant (Title) products. Test with a fixture per option name.
- `findVariantBySlug(product, shadeSlug): Variant | undefined` - slugifies every variant's shade option value and returns the variant whose slug === shadeSlug (case-insensitive). Test: exact match, no match (returns undefined), and a SLUG-COLLISION fixture (two values slugify identically) asserting deterministic first-match + logging.
- `buildShadePath(handle, optionValue, pathPrefix): string` - `${pathPrefix}/products/${handle}/${slugifyShade(optionValue)}`.

**TDD per helper:** write the failing test (`pnpm test:unit shadeUrl`), implement minimal, re-run green, commit (`feat: shade slug helpers`).

**Gotcha to test:** slug collisions. If two of a product's shade values slugify to the same string, the resolver must be deterministic and the build must log it so we can catch catalogue data needing a tweak disambiguator. Add a test asserting the collision is detected.

## Chunk 2: The path route + loader

**Files:** Create `app/routes/_store.($locale).products.$handle.$shade.tsx`.

- [ ] Loader: load the product by `params.handle` using the SAME product query/fragment as the existing product route. If `!product?.id` -> `throw new Response(null, {status: 404})`.
- [ ] Resolve the variant: `const variant = findVariantBySlug(product, params.shade)`. If no variant -> `throw redirect(pathPrefix + '/products/' + handle, {status: 301})` (NOT 404 - protect backlinks; the bare product is the safe fallback).
- [ ] Render the existing ProductMain tree, passing the resolved variant explicitly as the selected variant (see Chunk 4 for the context change so the frontend uses THIS variant, not searchParams).
- [ ] SEO: per-shade canonical `pathPrefix + '/products/' + handle + '/' + params.shade`, and the og:url to match. This is the SEO win - each shade canonicalises to ITSELF.
- [ ] RR7 matching: `/products/<handle>/<shade>` must resolve to THIS route, not the catch-all `_store.$.tsx`. Verify most-specific-match wins (curl a path URL on localhost, expect 200 not the catch-all 404).

**Test (Playwright + curl):** `curl -sI localhost:3000/products/crayon-lumiere/vert-empire` -> 200; the rendered HTML canonical == the path URL; a bad slug `/products/crayon-lumiere/not-a-shade` -> 301 to `/products/crayon-lumiere`. Commit (`feat: path-based shade route + loader`).

## Chunk 3: 301 redirects from the old query URLs

**Files:** Modify `app/routes/_store.($locale).products.$handle.tsx` loader (early, before `getSelectedProductOptions`).

- [ ] After loading the product, check the incoming query for ANY of the product's own shade option names (use `getShadeOptionName`). If a shade query param is present with a value that resolves to a variant, `throw redirect(buildShadePath(handle, value, pathPrefix), {status: 301})`. Preserve genuinely-useful non-shade params (none needed; drop tracking params from the redirect target so the new URL is clean).
- [ ] Extend the existing `?variant=<id>` chain (`:66-112`): instead of redirecting `?variant=<id>` -> `?<OptionName>=`, redirect it straight to the path URL. This keeps the Merchant Center feed (which emits `?variant=<id>`) resolving to the canonical path in ONE hop.
- [ ] The existing `redirectToFirstVariant` (`:330-344`): when a bare product URL has no shade, redirect to the FIRST shade's PATH url, not the query url. Reuse `buildShadePath`.

**Test (curl, all `?bust=N`):**
- `?Teinte=Vert+Empire` -> 301 -> `/products/crayon-lumiere/vert-empire`
- `?Color=...`, `?Shade=...`, `?Shades=...`, `?Teintes=...` each -> 301 to path (test one product per option name)
- `?variant=<id>` -> 301 -> path (one hop)
- `?Teinte=Vert+Empire&utm_source=email&fbclid=x` -> 301 -> clean path (tracking dropped)
- bare `/products/crayon-lumiere` -> 301 -> first shade path
Commit (`feat: 301 query shade urls + variant chain to path`).

## Chunk 4: Frontend - path links + the drawer out-of-stock fix

**Files:** Modify `ProductVariants.tsx`, `ProductView.tsx` (context), `ProductViewDrawerContent.tsx`.

- [ ] ProductVariants: remove the `SHADE_LINK_HANDLES` gate (`:18`). EVERY product renders shade swatches as `<Link to={buildShadePath(...)}>` (crawlable), not Radix RadioGroup buttons and not `?Shade=` links. ShadeOption already supports `to`.
- [ ] Stop the pollution at the source: the `useEffect` at `:84-90` must NOT map non-option params into `selectedOptions`. Either (a) the shade now comes from the path-resolved variant via context so this effect is no longer the shade source, or (b) filter `searchParams.entries()` to only the product's own option names before `setSelectedOptions`. Prefer (a): the path route passes the resolved variant; the frontend reads the shade from it.
- [ ] ProductView context: accept an explicit `selectedVariant` (the path-resolved one) and expose it. The drawer + ATC read THIS, not a searchParams-derived match.
- [ ] ProductViewDrawerContent (`:31-35`): replace the `JSON.stringify` equality with a read of the context's path-resolved `selectedVariant` (or, if a local match is still needed, match on the product's option names only, ignoring unknown params). This is the OOS fix.

**Test (Playwright, 4 viewports + the drawer):**
- On a path URL with tracking params (`/products/crayon-lumiere/vert-empire?utm_source=email&fbclid=x`): open the "available shades" drawer, the ATC button reads "add ..." NOT "out of stock". This is the regression-killer for the bug Carrie reported.
- Clicking a shade swatch navigates to the path URL and updates the selected shade + image.
- View source shows shade swatches as `<a href="/products/.../<slug>">` for a NON-pink product (crawlable rollout confirmed).
Commit (`fix: read shade from path, kill drawer out-of-stock on tracking params`).

## Chunk 5: Per-shade canonical (confirm) + per-shade JSON-LD

**Files:** Modify the path route SEO (Chunk 2 set the canonical) + `products.$handle.tsx:236-257` JSON-LD.

- [ ] Confirm the canonical from Chunk 2 is per-shade on the path route (curl two different shade paths -> two DIFFERENT canonicals, each self-referential). This is the demonstrable SEO fix; capture the before/after curl for the client.
- [ ] JSON-LD: the Product offers should use the PATH urls per shade (not `?Shade=`), and the path route should emit per-shade structured data (the specific shade's name in the product name/variant, its image, its price/availability). Reuse the existing offer enumeration, swap the URL format to `buildShadePath`.

**Test (curl + grep):** `/products/crayon-lumiere/vert-empire` JSON-LD contains the path url + the Vert Empire image/price; canonical is self-referential. Commit (`feat: per-shade canonical + path-based JSON-LD`).

## Chunk 6: Sitemap shade URLs

**Files:** Modify `app/routes/_store.($locale).sitemap.$type.$page[.xml].tsx`.

- [ ] For each multi-variant product, emit `/products/<handle>/<shade-slug>` for every shade (query the product variants + option values, slugify). Keep the existing product + page + article entries.
- [ ] Respect the existing exclusion patterns (e.g. the `blog` page slug exclusion already shipped). Do not emit single-variant (Title) products as shade paths.

**Test (curl localhost):** the sanity/product sitemap now contains shade path URLs; spot-check 3 resolve to 200 on localhost. Commit (`feat: shade path urls in sitemap`).

## Chunk 7: Full test matrix + Playwright regression

**Files:** `e2e/smoke/shade-url.spec.ts` (new) + the existing suite.

- [ ] Playwright spec covering: one product per option name (Teinte/Color/Shade/Shades/Teintes) - path URL resolves, canonical self-referential, drawer ATC in-stock with tracking params, swatch navigation. 4 viewports.
- [ ] Redirect tests: old `?<name>=` -> 301 path, `?variant=<id>` -> 301 path, bare -> first shade.
- [ ] Single-variant (Title) product unaffected (no shade path, no regression).
- [ ] Run the FULL existing smoke suite to confirm no regression.
Commit (`test: shade url path migration e2e matrix`).

---

## Gotchas (read before building)

1. Option-name-agnostic ALWAYS. Never hardcode "Shade". Read the product's own `options[].name`. There are five live names.
2. Slug collisions within a product are possible (accent-only or number-only differences once slugified). Detect + log; do not silently serve the wrong shade.
3. The `caseInsensitiveMatch` + `ignoreUnknownOptions` behaviour is on the SERVER fragment; the FRONTEND drawer had neither, which is the OOS bug. The fix is to make the frontend read the path-resolved variant, not re-derive from searchParams.
4. Merchant Center: keep the `?variant=<id>` chain working but pointed at the path in one hop. Verify ONE variant feed URL end-to-end after build (curl the chain).
5. Do NOT ship. This branch never merges to dev or master until Tim has client approval. All verification is on localhost + the isolated branch preview if one is built.
6. Oxygen 24h sitemap cache: any sitemap verification uses `?bust=N`.

## Verification plan (qa, once built)

- Layer 1: `pnpm typecheck` + `pnpm test:unit` + `pnpm build` green.
- Layer 2: the curl matrix above (redirects, canonicals self-referential, sitemap shade urls 200).
- Layer 3: Playwright (the new spec + full smoke), 4 viewports, when Chrome is back; the drawer OOS-with-tracking-params is the key regression test.
- Layer 5: confirm one Merchant Center `?variant=<id>` URL resolves through to the path in one hop.

## Self-review (done)

- Spec coverage: per-shade canonical (Chunk 2/5), OOS fix (Chunk 4), 301 back-compat all 5 names + variant chain (Chunk 3), sitemap (Chunk 6), per-shade JSON-LD (Chunk 5), all-products name-agnostic (Chunk 1 resolver), slug-as-is (Chunk 1). Covered.
- No placeholders for the tricky logic (resolver, redirects, OOS fix specified with file:line + approach). The building dev writes exact code via TDD against these specs.
- Interface consistency: `slugifyShade` / `findVariantBySlug` / `getShadeOptionName` / `buildShadePath` used consistently across chunks.
