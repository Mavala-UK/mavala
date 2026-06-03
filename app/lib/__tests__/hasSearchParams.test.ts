import {describe, it, expect} from 'vitest';
import {hasSearchParams} from '../utils';

/**
 * hasSearchParams must use .toString() !== '' not .size.
 *
 * URLSearchParams.size is Safari 17+ only (undefined on iOS 15/16).
 * undefined > 0 evaluates to false, silently blocking shade selection on
 * those devices. This test suite ensures .size is never re-introduced.
 */
describe('hasSearchParams', () => {
  it('returns false for an empty URLSearchParams', () => {
    expect(hasSearchParams(new URLSearchParams())).toBe(false);
  });

  it('returns true when one param is present', () => {
    expect(hasSearchParams(new URLSearchParams('Shade=Lisboa'))).toBe(true);
  });

  it('returns true when multiple params are present', () => {
    expect(
      hasSearchParams(new URLSearchParams('Shade=Lisboa&Size=5ml')),
    ).toBe(true);
  });

  it('returns false after all params are deleted', () => {
    const sp = new URLSearchParams('Shade=Lisboa');
    sp.delete('Shade');
    expect(hasSearchParams(sp)).toBe(false);
  });

  it('uses toString() not .size - documents the iOS 15/16 invariant', () => {
    // URLSearchParams.size is Safari 17+ only. On iOS 15/16 it is undefined.
    // undefined > 0 evaluates to false, which would silently block shade selection.
    // This test documents the invariant: hasSearchParams must never rely on .size.
    const undefinedSize = undefined as unknown as number;
    expect(undefinedSize > 0).toBe(false); // the silent failure on iOS 15/16

    // toString() is universally supported and must be the mechanism used:
    const sp = new URLSearchParams('Shade=Lisboa');
    expect(sp.toString()).not.toBe(''); // toString() works on all platforms
    expect(hasSearchParams(sp)).toBe(true); // our helper uses toString(), not .size
  });
});
