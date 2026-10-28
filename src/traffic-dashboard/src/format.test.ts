// Verifies dashboard formatting during regression tests.
import { describe, expect, it } from 'vitest';

import { DEFAULT_LICENSE_COLOR, licenseColor } from '#traffic-dashboard/utils/license-color.ts';

describe('licenseColor', () => {
  it.each([
    ['A 4.16', '#006EFF'],
    ['B 3.20', '#33CC00'],
    ['C 2.99', '#FFCC00'],
    ['D 1.50', '#FF6600'],
    ['R 0.01', '#E1251B'],
    ['P 9.99', '#FFFFFF'],
    ['PRO 9.99', '#FFFFFF'],
    ['WC 9.99', '#FFFFFF'],
  ])('given license %s when its color is requested then it is %s', (license, expected) => {
    expect(licenseColor(license)).toBe(expected);
  });

  it('given a lowercase A license when its color is requested then it is blue', () => {
    expect(licenseColor('a 4.16')).toBe('#006EFF');
  });

  it('given an A license without a safety rating when its color is requested then it is blue', () => {
    expect(licenseColor('A')).toBe('#006EFF');
  });

  it('given an unknown license class when its color is requested then the default color is returned', () => {
    expect(licenseColor('Z 1.00')).toBe(DEFAULT_LICENSE_COLOR);
  });

  it('given an empty license when its color is requested then the default color is returned', () => {
    expect(licenseColor('')).toBe(DEFAULT_LICENSE_COLOR);
  });
});
