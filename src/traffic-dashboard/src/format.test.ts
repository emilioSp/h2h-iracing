import { describe, expect, it } from 'vitest';
import { DEFAULT_LICENSE_COLOR, licenseColor } from './format.ts';

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
  ])('colours %s', (license, expected) => {
    expect(licenseColor(license)).toBe(expected);
  });

  it('ignores the case of the class', () => {
    expect(licenseColor('a 4.16')).toBe('#006EFF');
  });

  it('reads a class with no safety rating', () => {
    expect(licenseColor('A')).toBe('#006EFF');
  });

  it('falls back for an unknown class', () => {
    expect(licenseColor('Z 1.00')).toBe(DEFAULT_LICENSE_COLOR);
  });

  it('falls back for an empty licence', () => {
    expect(licenseColor('')).toBe(DEFAULT_LICENSE_COLOR);
  });
});
