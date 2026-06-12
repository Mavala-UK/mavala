/**
 * On-site search variant matching.
 *
 * Shopify's `search` query returns parent products; it does not tell us which
 * variant matched the term. When a customer searches a shade name ("Riga") or
 * a shade number ("701"), we want the search card to surface the MATCHING
 * VARIANT (its image, its name, a link to the canonical shade path URL) rather
 * than the parent product's default variant. mavala.fr does this; the UK site
 * did not.
 *
 * This module scores each product's variants against the search term and
 * returns the best match plus the slug used to build its canonical shade path
 * (the same `/products/<handle>/<shade-slug>` format the path-URL migration
 * produces, via the shared helpers in shadeUrl.ts).
 *
 * Two hard rules, both enforced by tests:
 *   1. Option-name-agnostic. We resolve the product's own shade option from the
 *      variants' selectedOptions (Teinte / Color / Shade / Shades / Teintes /
 *      Colour, via SHADE_OPTION_ALLOWLIST); we NEVER hardcode "Shade".
 *   2. We only ever score against the shade option VALUE and the variant TITLE,
 *      never the product title or the option name. That is what stops a
 *      parent-name search ("Mini Color") or a category search ("nail polish")
 *      from falsely matching a variant.
 *
 * The shade option is resolved from the variants alone (not product.options),
 * because the Storefront `search` query nodes carry variants.selectedOptions
 * but NOT the top-level options[] field. Resolving from variants keeps the
 * search query unchanged and works for any ProductItem-shaped node.
 */

import {SHADE_OPTION_ALLOWLIST, slugifyShade} from '~/lib/shadeUrl';

// ── normalisation ─────────────────────────────────────────────────────────────

/**
 * Lowercase + strip accents so "Rhône" and "rhone" compare equal.
 * Mirrors the NFD accent-stripping used by slugify(), but keeps spaces and
 * punctuation so we can do word-boundary matching on the raw value.
 */
function normalise(value: string): string {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritical marks (NFD), matches slugify()
    .trim();
}

/**
 * Tokenise a normalised string into word tokens (letters/numbers), dropping
 * punctuation. "56. riga" -> ["56", "riga"]; "rio grande" -> ["rio", "grande"].
 */
function tokenise(normalised: string): string[] {
  return normalised.split(/[^a-z0-9]+/i).filter(Boolean);
}

// ── shape interfaces (variant-only; no product.options needed) ────────────────

interface MatchSelectedOption {
  name: string;
  value: string;
}

interface MatchVariant {
  id: string;
  title: string;
  selectedOptions: MatchSelectedOption[];
}

interface MatchProduct {
  variants: {nodes: MatchVariant[]};
}

/**
 * Resolve the product's shade option name from its VARIANTS' selectedOptions,
 * without needing the top-level options[] field (which the search query does
 * not fetch).
 *
 * An option name qualifies when it is in SHADE_OPTION_ALLOWLIST AND has more
 * than one distinct value across the variants. "Packaging" is excluded by the
 * allowlist; single-value options (single-variant products) are excluded by
 * the distinct-value count. Returns the first qualifying option name in the
 * order option names first appear, or null.
 */
export function resolveShadeOptionFromVariants(
  product: MatchProduct,
): string | null {
  const valuesByOption = new Map<string, Set<string>>();
  const order: string[] = [];

  for (const variant of product.variants?.nodes ?? []) {
    for (const opt of variant.selectedOptions ?? []) {
      if (!SHADE_OPTION_ALLOWLIST.has(opt.name.toLowerCase())) continue;
      if (!valuesByOption.has(opt.name)) {
        valuesByOption.set(opt.name, new Set());
        order.push(opt.name);
      }
      valuesByOption.get(opt.name)!.add(opt.value);
    }
  }

  for (const name of order) {
    if ((valuesByOption.get(name)?.size ?? 0) > 1) return name;
  }
  return null;
}

// Score bands. Higher = better. Exact hits beat word hits beat substring hits.
const SCORE_EXACT_VALUE = 100;
const SCORE_EXACT_TITLE = 90;
const SCORE_WORD = 60;
const SCORE_SUBSTRING = 30;

// ── scoreVariant ──────────────────────────────────────────────────────────────

/**
 * Score a single variant against a search term, considering ONLY this variant's
 * value for `optionName` and its title. Returns 0 when nothing matches.
 *
 * @param term       raw search term (e.g. "Riga", "701")
 * @param variant    the variant (selectedOptions + title)
 * @param optionName the resolved shade option name for this product
 */
export function scoreVariant(
  term: string,
  variant: {title: string; selectedOptions: {name: string; value: string}[]},
  optionName: string,
): number {
  const t = normalise(term);
  if (!t) return 0;

  const optionValue = variant.selectedOptions.find(
    (o) => o.name === optionName,
  )?.value;
  if (!optionValue) return 0;

  const value = normalise(optionValue);
  const title = normalise(variant.title);

  // Exact hits first.
  if (t === value) return SCORE_EXACT_VALUE;
  if (t === title) return SCORE_EXACT_TITLE;

  const valueTokens = tokenise(value);
  const titleTokens = tokenise(title);
  const termTokens = tokenise(t);

  // Whole-word match: every token of the term is a whole token of the value
  // (or the title). "Riga" matches "56. Riga"; "rio grande" matches
  // "701. Rio Grande"; "701" matches "701. Rio Grande". Multi-word parent
  // names like "mini color" will not, because "mini"/"color" are not tokens
  // of any shade value.
  if (termTokens.length > 0) {
    const valueTokenSet = new Set(valueTokens);
    const titleTokenSet = new Set(titleTokens);
    const allInValue = termTokens.every((tok) => valueTokenSet.has(tok));
    const allInTitle = termTokens.every((tok) => titleTokenSet.has(tok));
    if (allInValue || allInTitle) return SCORE_WORD;
  }

  // Substring fallback, but only for terms of 3+ chars. This catches partial
  // names ("emp" -> "vert empire") while preventing a stray "5" or "56"
  // fragment from junk-matching every numbered shade.
  if (t.length >= 3 && (value.includes(t) || title.includes(t))) {
    return SCORE_SUBSTRING;
  }

  return 0;
}

// ── matchVariantForTerm ───────────────────────────────────────────────────────

/**
 * Serializable result attached to a search product node. Carries the matched
 * variant's id (the stable handle the card uses to re-find the variant after a
 * TanStack re-fetch), display fields, and the canonical shade slug.
 */
export interface VariantMatch {
  /** Stable GID of the best-matching variant. */
  variantId: string;
  /** Slug for the canonical shade path (e.g. "56-riga"). */
  shadeSlug: string;
  /** The resolved shade option name (e.g. "Shade", "Color"). */
  optionName: string;
  /** The raw shade option value of the matched variant (e.g. "56. Riga"). */
  optionValue: string;
  /** The matched variant's title (e.g. "56. Riga"). */
  variantTitle: string;
  /** The winning score (for debugging / future tuning). */
  score: number;
}

/**
 * Find the best variant in `product` for `term`, or null when nothing scores.
 *
 * Returns the matched variant id, its canonical shade slug (for buildShadePath),
 * the shade option name + value, and the variant title. Returns null for:
 *   - single-variant products (no multi-value shade option)
 *   - parent-name / category searches that match no variant value
 *   - any product whose best variant slugifies to an empty string
 *
 * On a score tie the FIRST variant in catalogue order wins (deterministic).
 */
export function matchVariantForTerm(
  product: MatchProduct & {title?: string},
  term: string,
): VariantMatch | null {
  const optionName = resolveShadeOptionFromVariants(product);
  if (!optionName) return null;

  const nodes = product.variants?.nodes ?? [];
  if (nodes.length === 0) return null;

  let best: VariantMatch | null = null;

  for (const variant of nodes) {
    const score = scoreVariant(term, variant, optionName);
    if (score <= 0) continue;
    // Strictly-greater keeps the first variant on a tie (deterministic order).
    if (best && score <= best.score) continue;

    const optionValue = variant.selectedOptions.find(
      (o) => o.name === optionName,
    )?.value;
    if (!optionValue) continue;

    const shadeSlug = slugifyShade(optionValue);
    // A shade value that slugifies to "" cannot form a usable path URL.
    if (!shadeSlug) continue;

    best = {
      variantId: variant.id,
      shadeSlug,
      optionName,
      optionValue,
      variantTitle: variant.title,
      score,
    };
  }

  return best;
}
