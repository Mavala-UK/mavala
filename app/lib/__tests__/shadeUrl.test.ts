/**
 * Tests for app/lib/shadeUrl.ts
 *
 * TDD: tests written first (red), then implementation (green).
 * Each function is option-name-agnostic - it reads the product's own options,
 * never hardcodes "Shade" / "Teinte" / "Color".
 */
import {describe, it, expect, vi} from 'vitest';
import {
  slugifyShade,
  getShadeOptionName,
  findVariantBySlug,
  buildShadePath,
} from '../shadeUrl';

// ── minimal product fixture types ────────────────────────────────────────────

interface FixtureOption {
  name: string;
  values: string[];
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
  options: FixtureOption[];
  variants: {nodes: FixtureVariant[]};
}

function makeProduct(
  optionName: string,
  shadeValues: string[],
): FixtureProduct {
  return {
    options: [{name: optionName, values: shadeValues}],
    variants: {
      nodes: shadeValues.map((v, i) => ({
        id: `gid://shopify/ProductVariant/${i + 1}`,
        title: v,
        selectedOptions: [{name: optionName, value: v}],
      })),
    },
  };
}

// ── slugifyShade ──────────────────────────────────────────────────────────────

describe('slugifyShade', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugifyShade('Vert Empire')).toBe('vert-empire');
  });

  it('strips accents (NFD normalise)', () => {
    expect(slugifyShade('Vert Celeste')).toBe('vert-celeste');
  });

  it('strips accents on more complex values', () => {
    expect(slugifyShade('Perle Noire')).toBe('perle-noire');
  });

  it('preserves numbers and handles a leading number + period', () => {
    expect(slugifyShade('9. Lisboa')).toBe('9-lisboa');
  });

  it('collapses repeated hyphens', () => {
    expect(slugifyShade('Rose  Glacee')).toBe('rose-glacee');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugifyShade(' Leading')).toBe('leading');
    expect(slugifyShade('Trailing ')).toBe('trailing');
  });

  it('drops a trailing period', () => {
    expect(slugifyShade('Nr. 9.')).toBe('nr-9');
  });

  it('handles empty string gracefully', () => {
    expect(slugifyShade('')).toBe('');
  });

  it('handles single-word values', () => {
    expect(slugifyShade('Bordeaux')).toBe('bordeaux');
  });
});

// ── getShadeOptionName ────────────────────────────────────────────────────────

describe('getShadeOptionName', () => {
  it('returns "Teinte" for a product with Teinte multi-value option', () => {
    const product = makeProduct('Teinte', ['Vert Empire', 'Vert Celeste']);
    expect(getShadeOptionName(product)).toBe('Teinte');
  });

  it('returns "Color" for a product with Color multi-value option', () => {
    const product = makeProduct('Color', ['Red', 'Blue']);
    expect(getShadeOptionName(product)).toBe('Color');
  });

  it('returns "Shade" for a product with Shade multi-value option', () => {
    const product = makeProduct('Shade', ['9. Lisboa', '10. Milano']);
    expect(getShadeOptionName(product)).toBe('Shade');
  });

  it('returns "Shades" for a product with Shades multi-value option', () => {
    const product = makeProduct('Shades', ['Or Precieux', 'Violet Cerise']);
    expect(getShadeOptionName(product)).toBe('Shades');
  });

  it('returns "Teintes" for a product with Teintes multi-value option', () => {
    const product = makeProduct('Teintes', ['Rose Glace']);
    expect(getShadeOptionName(product)).toBe(null); // only one value = single-variant
  });

  it('returns null for a single-variant product (Title option)', () => {
    const product: FixtureProduct = {
      options: [{name: 'Title', values: ['Default Title']}],
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
    expect(getShadeOptionName(product)).toBeNull();
  });

  it('returns null when no option has more than one value', () => {
    const product = makeProduct('Color', ['Only One']);
    expect(getShadeOptionName(product)).toBeNull();
  });

  it('returns "Teintes" when that option has multiple values', () => {
    const product = makeProduct('Teintes', ['Beige', 'Rose']);
    expect(getShadeOptionName(product)).toBe('Teintes');
  });
});

// ── findVariantBySlug ─────────────────────────────────────────────────────────

describe('findVariantBySlug', () => {
  const product = makeProduct('Teinte', [
    'Vert Empire',
    'Vert Celeste',
    '9. Lisboa',
  ]);

  it('finds a variant by its slugified shade value (exact match)', () => {
    const v = findVariantBySlug(product, 'vert-empire');
    expect(v?.selectedOptions[0].value).toBe('Vert Empire');
  });

  it('finds a numbered shade (9. Lisboa -> 9-lisboa)', () => {
    const v = findVariantBySlug(product, '9-lisboa');
    expect(v?.selectedOptions[0].value).toBe('9. Lisboa');
  });

  it('finds by slug regardless of input slug case', () => {
    const v = findVariantBySlug(product, 'VERT-EMPIRE');
    expect(v?.selectedOptions[0].value).toBe('Vert Empire');
  });

  it('returns undefined when no variant matches the slug', () => {
    const v = findVariantBySlug(product, 'not-a-real-shade');
    expect(v).toBeUndefined();
  });

  it('returns undefined for a product with no shade option', () => {
    const singleVariant: FixtureProduct = {
      options: [{name: 'Title', values: ['Default Title']}],
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
    const v = findVariantBySlug(singleVariant, 'anything');
    expect(v).toBeUndefined();
  });

  it('COLLISION: deterministic first-match when two values slugify identically', () => {
    // "blanc" and "Blanc" both -> "blanc"
    const collisionProduct = makeProduct('Color', ['blanc', 'Blanc', 'Rouge']);
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const v = findVariantBySlug(collisionProduct, 'blanc');
    // Returns the FIRST match deterministically
    expect(v?.selectedOptions[0].value).toBe('blanc');
    // Warns about the collision
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('slug collision'),
    );
    spy.mockRestore();
  });
});

// ── buildShadePath ────────────────────────────────────────────────────────────

describe('buildShadePath', () => {
  it('builds a clean path from handle + shade option value', () => {
    expect(buildShadePath('crayon-lumiere', 'Vert Empire', '')).toBe(
      '/products/crayon-lumiere/vert-empire',
    );
  });

  it('includes a non-empty pathPrefix', () => {
    expect(buildShadePath('mini-color-pink', '9. Lisboa', '/en')).toBe(
      '/en/products/mini-color-pink/9-lisboa',
    );
  });

  it('handles empty pathPrefix (the UK case)', () => {
    expect(buildShadePath('mascara-vl', 'Black', '')).toBe(
      '/products/mascara-vl/black',
    );
  });
});
