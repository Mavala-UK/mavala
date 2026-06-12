/**
 * Tests for app/lib/searchVariantMatch.ts
 *
 * TDD: tests written first (red), then implementation (green).
 *
 * The matcher scores a product's variants against a search term and returns
 * the best matching variant id + its canonical shade path slug, or null when
 * nothing matches. It is option-name-agnostic (resolves the product's own shade
 * option from the variants' selectedOptions) and only ever scores against shade
 * option VALUES and variant TITLES, never the product title or the option name.
 * This is what stops a parent-name search ("Mini Color") from falsely matching
 * a variant.
 */
import {describe, it, expect} from 'vitest';
import {
  scoreVariant,
  matchVariantForTerm,
  resolveShadeOptionFromVariants,
} from '../searchVariantMatch';

// ── minimal product fixture types ────────────────────────────────────────────

interface FixtureOption {
  name: string;
  optionValues: {name: string}[];
}

interface FixtureSelectedOption {
  name: string;
  value: string;
}

interface FixtureVariant {
  id: string;
  title: string;
  selectedOptions: FixtureSelectedOption[];
}

interface FixtureProduct {
  title?: string;
  options: FixtureOption[];
  variants: {nodes: FixtureVariant[]};
}

function makeProduct(
  optionName: string,
  shadeValues: string[],
  title = 'A Product',
): FixtureProduct {
  return {
    title,
    options: [
      {name: optionName, optionValues: shadeValues.map((v) => ({name: v}))},
    ],
    variants: {
      nodes: shadeValues.map((v, i) => ({
        id: `gid://shopify/ProductVariant/${i + 1}`,
        title: v,
        selectedOptions: [{name: optionName, value: v}],
      })),
    },
  };
}

// ── scoreVariant ──────────────────────────────────────────────────────────────

describe('scoreVariant', () => {
  const variant: FixtureVariant = {
    id: 'gid://1',
    title: '56. Riga',
    selectedOptions: [{name: 'Shade', value: '56. Riga'}],
  };

  it('exact option-value match scores highest', () => {
    const exact = scoreVariant('56. Riga', variant, 'Shade');
    const word = scoreVariant('Riga', variant, 'Shade');
    expect(exact).toBeGreaterThan(word);
  });

  it('whole-word name match (the shade name part) scores positive', () => {
    expect(scoreVariant('Riga', variant, 'Shade')).toBeGreaterThan(0);
  });

  it('numeric-prefix match (the leading number) scores positive', () => {
    expect(scoreVariant('56', variant, 'Shade')).toBeGreaterThan(0);
  });

  it('is case-insensitive', () => {
    expect(scoreVariant('riga', variant, 'Shade')).toBeGreaterThan(0);
    expect(scoreVariant('RIGA', variant, 'Shade')).toBeGreaterThan(0);
  });

  it('is accent-insensitive', () => {
    const accented: FixtureVariant = {
      id: 'gid://2',
      title: 'Rhône',
      selectedOptions: [{name: 'Color', value: '704. Rhône'}],
    };
    expect(scoreVariant('rhone', accented, 'Color')).toBeGreaterThan(0);
  });

  it('returns 0 when the term is not present in the shade value at all', () => {
    expect(scoreVariant('Lisboa', variant, 'Shade')).toBe(0);
  });

  it('does NOT match on the parent product name token ("color")', () => {
    // The option NAME is "Shade" here; "color" appears nowhere in the value.
    expect(scoreVariant('color', variant, 'Shade')).toBe(0);
  });

  it('does NOT match the option name itself ("shade")', () => {
    // Searching the option name must never score; only the VALUE counts.
    expect(scoreVariant('shade', variant, 'Shade')).toBe(0);
  });

  it('does not let a 1-2 char numeric fragment substring-match a longer number', () => {
    // "Riga" is "56. Riga"; searching "5" must NOT score (would be a junk match).
    expect(scoreVariant('5', variant, 'Shade')).toBe(0);
  });

  it('exact variant-title match scores when title differs from the option value', () => {
    const v: FixtureVariant = {
      id: 'gid://3',
      title: 'Black - 30ml',
      selectedOptions: [{name: 'Shade', value: 'Black'}],
    };
    // Searching the full variant title is an exact title hit.
    expect(scoreVariant('Black - 30ml', v, 'Shade')).toBeGreaterThan(0);
  });

  it('ignores a blank/whitespace term', () => {
    expect(scoreVariant('   ', variant, 'Shade')).toBe(0);
    expect(scoreVariant('', variant, 'Shade')).toBe(0);
  });
});

// ── matchVariantForTerm ───────────────────────────────────────────────────────

describe('matchVariantForTerm', () => {
  it('matches "Riga" to the "56. Riga" variant and returns the slug', () => {
    const product = makeProduct(
      'Shade',
      ['9. Lisboa', '11. Hanoi', '56. Riga'],
      'Mini Color Nail Polish Pink',
    );
    const m = matchVariantForTerm(product, 'Riga');
    expect(m).not.toBeNull();
    expect(m!.variantTitle).toBe('56. Riga');
    expect(m!.shadeSlug).toBe('56-riga');
    expect(m!.optionName).toBe('Shade');
    expect(m!.optionValue).toBe('56. Riga');
  });

  it('matches a shade NUMBER ("701") to the "701. Rio Grande" variant (Color option)', () => {
    const product = makeProduct(
      'Color',
      ['701. Rio Grande', '702. Mississippi', '704. Rhône'],
      'Mini Bio Color Nail Polish Pink',
    );
    const m = matchVariantForTerm(product, '701');
    expect(m).not.toBeNull();
    expect(m!.variantTitle).toBe('701. Rio Grande');
    expect(m!.shadeSlug).toBe('701-rio-grande');
    expect(m!.optionName).toBe('Color');
  });

  it('returns null for the parent-name search "Mini Color" (no variant value matches)', () => {
    const product = makeProduct(
      'Shade',
      ['9. Lisboa', '11. Hanoi', '56. Riga'],
      'Mini Color Nail Polish Pink',
    );
    expect(matchVariantForTerm(product, 'Mini Color')).toBeNull();
  });

  it('returns null for a category search "nail polish" (no variant value matches)', () => {
    const product = makeProduct(
      'Shade',
      ['9. Lisboa', '11. Hanoi'],
      'Mini Color Nail Polish Pink',
    );
    expect(matchVariantForTerm(product, 'nail polish')).toBeNull();
  });

  it('returns null for a single-variant product (no shade option)', () => {
    const single: FixtureProduct = {
      title: 'Mavadry Spray',
      options: [{name: 'Title', optionValues: [{name: 'Default Title'}]}],
      variants: {
        nodes: [
          {
            id: 'gid://1',
            title: 'Default Title',
            selectedOptions: [{name: 'Title', value: 'Default Title'}],
          },
        ],
      },
    };
    expect(matchVariantForTerm(single, 'spray')).toBeNull();
  });

  it('returns null for a no-match number ("275")', () => {
    const product = makeProduct('Color', ['701. Rio Grande', '702. Mississippi']);
    expect(matchVariantForTerm(product, '275')).toBeNull();
  });

  it('prefers an exact value match over a substring match when both exist', () => {
    // "Rose" should pick the exact "Rose" variant, not "Rose Glacee".
    const product = makeProduct('Teinte', ['Rose Glacee', 'Rose', 'Rouge']);
    const m = matchVariantForTerm(product, 'Rose');
    expect(m!.variantTitle).toBe('Rose');
  });

  it('is deterministic: first variant wins on a score tie', () => {
    // Two variants both contain the word "Vert"; the FIRST in catalogue order wins.
    const product = makeProduct('Teinte', ['Vert Empire', 'Vert Celeste']);
    const m = matchVariantForTerm(product, 'Vert');
    expect(m!.variantTitle).toBe('Vert Empire');
  });

  it('handles a product with empty variants gracefully', () => {
    const product: FixtureProduct = {
      title: 'Empty',
      options: [{name: 'Shade', optionValues: []}],
      variants: {nodes: []},
    };
    expect(matchVariantForTerm(product, 'anything')).toBeNull();
  });

  it('ignores a Packaging (non-shade) multi-value option', () => {
    const product: FixtureProduct = {
      title: 'Packaged',
      options: [{name: 'Packaging', optionValues: [{name: 'Small'}, {name: 'Large'}]}],
      variants: {
        nodes: [
          {
            id: 'gid://1',
            title: 'Small',
            selectedOptions: [{name: 'Packaging', value: 'Small'}],
          },
          {
            id: 'gid://2',
            title: 'Large',
            selectedOptions: [{name: 'Packaging', value: 'Large'}],
          },
        ],
      },
    };
    // "Small" is a Packaging value, not a shade -> no shade match.
    expect(matchVariantForTerm(product, 'Small')).toBeNull();
  });

  it('returns null when the resolved variant slug would be empty', () => {
    // A degenerate shade value "..." slugifies to "" -> not a usable path.
    const product = makeProduct('Color', ['...']);
    expect(matchVariantForTerm(product, '...')).toBeNull();
  });
});

// ── resolveShadeOptionFromVariants ────────────────────────────────────────────
// This is the PRODUCTION resolution path: the Storefront search query carries
// variants.selectedOptions but NOT product.options, so the shade option name is
// derived from the variants alone.

describe('resolveShadeOptionFromVariants', () => {
  it('resolves each live option-name style from variants', () => {
    for (const name of ['Teinte', 'Teintes', 'Color', 'Colour', 'Shade', 'Shades']) {
      const product = makeProduct(name, ['Value One', 'Value Two']);
      expect(resolveShadeOptionFromVariants(product)).toBe(name);
    }
  });

  it('returns null when the single shade option has only one value (single-variant)', () => {
    const product = makeProduct('Color', ['Only One']);
    expect(resolveShadeOptionFromVariants(product)).toBeNull();
  });

  it('returns null for a Title-only single-variant product', () => {
    const product: FixtureProduct = {
      options: [{name: 'Title', optionValues: [{name: 'Default Title'}]}],
      variants: {
        nodes: [
          {
            id: 'gid://1',
            title: 'Default Title',
            selectedOptions: [{name: 'Title', value: 'Default Title'}],
          },
        ],
      },
    };
    expect(resolveShadeOptionFromVariants(product)).toBeNull();
  });

  it('ignores Packaging (not in the shade allowlist) even with multiple values', () => {
    const product = makeProduct('Packaging', ['Small', 'Large']);
    expect(resolveShadeOptionFromVariants(product)).toBeNull();
  });

  it('picks the shade option when Packaging + Teinte both vary (allowlist wins)', () => {
    const product: FixtureProduct = {
      options: [],
      variants: {
        nodes: [
          {
            id: 'gid://1',
            title: 'Small / Vert Empire',
            selectedOptions: [
              {name: 'Packaging', value: 'Small'},
              {name: 'Teinte', value: 'Vert Empire'},
            ],
          },
          {
            id: 'gid://2',
            title: 'Large / Vert Celeste',
            selectedOptions: [
              {name: 'Packaging', value: 'Large'},
              {name: 'Teinte', value: 'Vert Celeste'},
            ],
          },
        ],
      },
    };
    expect(resolveShadeOptionFromVariants(product)).toBe('Teinte');
  });

  it('returns null for empty variants', () => {
    expect(resolveShadeOptionFromVariants({variants: {nodes: []}})).toBeNull();
  });
});
