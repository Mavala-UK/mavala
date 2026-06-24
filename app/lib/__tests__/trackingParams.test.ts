/**
 * Tests for app/lib/trackingParams.ts
 *
 * The helper re-appends an allowlist of marketing params to a clean canonical
 * path. Non-allowlisted params (variant, Shade, ...) must be dropped so the
 * path stays canonical for SEO.
 */
import {describe, it, expect} from 'vitest';
import {withTrackingParams} from '../trackingParams';

describe('withTrackingParams', () => {
  it('preserves an allowlisted param', () => {
    const source = new URLSearchParams('gclid=ABC123');
    expect(withTrackingParams('/products/foo/bar', source)).toBe(
      '/products/foo/bar?gclid=ABC123',
    );
  });

  it('drops a non-allowlisted param (variant)', () => {
    const source = new URLSearchParams('variant=42');
    expect(withTrackingParams('/products/foo/bar', source)).toBe(
      '/products/foo/bar',
    );
  });

  it('drops a non-allowlisted param (Shade) while keeping allowlisted ones', () => {
    const source = new URLSearchParams('Shade=Vert+Empire&gclid=ABC123');
    expect(withTrackingParams('/products/foo/bar', source)).toBe(
      '/products/foo/bar?gclid=ABC123',
    );
  });

  it('returns the path unchanged for empty input', () => {
    expect(withTrackingParams('/products/foo/bar', new URLSearchParams())).toBe(
      '/products/foo/bar',
    );
  });

  it('preserves multiple allowlisted params in allowlist order', () => {
    const source = new URLSearchParams(
      'utm_source=google&utm_medium=cpc&gclid=ABC123',
    );
    expect(withTrackingParams('/products/foo/bar', source)).toBe(
      '/products/foo/bar?gclid=ABC123&utm_source=google&utm_medium=cpc',
    );
  });

  it('leaves an already-canonical path with no query untouched', () => {
    const source = new URLSearchParams();
    expect(withTrackingParams('/fr/products/foo', source)).toBe(
      '/fr/products/foo',
    );
  });
});
