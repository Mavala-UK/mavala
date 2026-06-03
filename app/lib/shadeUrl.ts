/**
 * Shade URL slug helpers.
 *
 * These are the building blocks for the path-based shade URL migration.
 * All helpers are option-name-agnostic: they read the product's own
 * options[] rather than hardcoding "Shade" / "Teinte" / "Color".
 *
 * Live catalogue option names (2026-06-03):
 *   Teinte x15, Color x12, Shade x10, Shades x2, Teintes x1, Packaging x1
 *   Title x114 (single-variant, excluded from shade paths)
 */

import {slugify} from '~/lib/utils';

// ── Minimal shape interfaces (product data used by these helpers) ─────────────

interface ShadeOption {
  name: string;
  values: string[];
}

interface ShadeSelectedOption {
  name: string;
  value: string;
}

export interface ShadeVariant {
  id: string;
  title: string;
  selectedOptions: ShadeSelectedOption[];
}

export interface ShadeProduct {
  options: ShadeOption[];
  variants: {nodes: ShadeVariant[]};
}

// ── slugifyShade ──────────────────────────────────────────────────────────────

/**
 * Converts a shade option value into a URL-safe path slug.
 *
 * Reuses slugify() from utils.ts (lowercase, strip accents, spaces -> hyphens,
 * drop non-word chars) and adds:
 *   - Collapse repeated hyphens ("rose--glacee" -> "rose-glacee")
 *   - Trim leading / trailing hyphens
 *   - Drop a trailing period before the final collapse
 *
 * Examples:
 *   "Vert Empire"   -> "vert-empire"
 *   "Vert Céleste"  -> "vert-celeste"
 *   "9. Lisboa"     -> "9-lisboa"
 *   " Leading"      -> "leading"
 */
export function slugifyShade(value: string): string {
  if (!value) return '';
  return slugify(value)
    .replace(/-{2,}/g, '-')   // collapse repeated hyphens
    .replace(/^-+|-+$/g, ''); // trim leading / trailing hyphens
}

// ── getShadeOptionName ────────────────────────────────────────────────────────

/**
 * Allowlisted shade option names (case-insensitive).
 * Non-shade multi-value options like "Packaging" are explicitly excluded
 * so they are never treated as shade selectors.
 * Live catalogue: Teinte x15, Color x12, Shade x10, Shades x2, Teintes x1.
 */
const SHADE_OPTION_ALLOWLIST = new Set([
  'teinte',
  'teintes',
  'color',
  'colour',
  'shade',
  'shades',
]);

/**
 * Returns the product's single multi-value shade option name
 * (e.g. "Teinte", "Color", "Shade") by finding the first option
 * whose name is in the SHADE_OPTION_ALLOWLIST AND has more than one value.
 *
 * Returns null for single-variant products (Title/Default Title),
 * for non-shade multi-value options (e.g. "Packaging"), and for any product
 * with no qualifying multi-value shade option.
 */
export function getShadeOptionName(product: ShadeProduct): string | null {
  const shadeOption = product.options.find(
    (o) =>
      o.values.length > 1 &&
      SHADE_OPTION_ALLOWLIST.has(o.name.toLowerCase()),
  );
  return shadeOption?.name ?? null;
}

// ── findVariantBySlug ─────────────────────────────────────────────────────────

/**
 * Finds the variant whose shade option value slugifies to `shadeSlug`
 * (case-insensitive). Returns undefined if no match.
 *
 * If multiple variants' slugs collide (two different option values produce the
 * same slug, e.g. "blanc" and "Blanc"), the FIRST match wins and a console.warn
 * is emitted so the catalogue data team can add a disambiguator.
 */
export function findVariantBySlug(
  product: ShadeProduct,
  shadeSlug: string,
): ShadeVariant | undefined {
  const optionName = getShadeOptionName(product);
  if (!optionName) return undefined;

  // Normalise the input slug via slugifyShade for robustness on
  // malformed path segments (e.g. "Vert-Empire" with capital).
  const normSlug = slugifyShade(shadeSlug);

  // Empty input slug must never match anything (an empty slug could
  // accidentally match variants whose values also slugify to '').
  if (!normSlug) return undefined;

  // Detect slug collisions across all variants; skip variants whose
  // shade value slugifies to empty (degenerate data, warn + skip).
  const matches = product.variants.nodes.filter((variant) => {
    const optValue = variant.selectedOptions.find(
      (o) => o.name === optionName,
    )?.value;
    if (!optValue) return false;
    const variantSlug = slugifyShade(optValue);
    if (!variantSlug) {
      console.warn(
        `shadeUrl: variant "${variant.id}" shade value "${optValue}" slugifies to empty string -- skipping`,
      );
      return false;
    }
    return variantSlug === normSlug;
  });

  if (matches.length > 1) {
    console.warn(
      `shadeUrl slug collision on "${shadeSlug}": ` +
        matches
          .map(
            (v) =>
              v.selectedOptions.find((o) => o.name === optionName)?.value ??
              v.id,
          )
          .join(', ') +
        ' -- first match returned, consider updating catalogue option values',
    );
  }

  return matches[0];
}

// ── buildShadePath ────────────────────────────────────────────────────────────

/**
 * Builds the canonical path URL for a shade.
 *
 * `${pathPrefix}/products/${handle}/${slugifyShade(optionValue)}`
 *
 * pathPrefix is empty string for the UK storefront (no locale prefix).
 */
export function buildShadePath(
  handle: string,
  optionValue: string,
  pathPrefix: string,
): string {
  return `${pathPrefix}/products/${handle}/${slugifyShade(optionValue)}`;
}
