import { describe, expect, it } from 'vitest';
import { guessCarClass } from '#server/utils/guess-car-class.ts';

describe('guessCarClass', () => {
  it.each([
    ['Ferrari 296 GT3', 'GT3'],
    ['Ford Mustang GT4', 'GT4'],
    ['Dallara F3', 'F3'],
    ['Porsche 911 Cup (992.2)', 'PCUP'],
    ['Ford GT GTE', 'GTE'],
    ['Aston Martin DBR9 GT1', 'GT1'],
    ['Dallara P217 LMP2', 'LMP2'],
  ])('maps %s to %s', (car, expected) => {
    expect(guessCarClass(car)).toBe(expected);
  });

  it.each([
    'Acura ARX-06',
    'Ferrari 499P',
    'Porsche 963',
  ])('falls back to GTP for %s', (car) => {
    expect(guessCarClass(car)).toBe('GTP');
  });

  it('keeps a GT3 R as GT3', () => {
    expect(guessCarClass('Porsche 911 GT3 R (992)')).toBe('GT3');
  });

  it('prefers PCUP over GT3 when the name has both', () => {
    expect(guessCarClass('Porsche 911 GT3 Cup (992)')).toBe('PCUP');
  });

  it('requires a word boundary', () => {
    expect(guessCarClass('Ferrari GT30000')).toBe('GTP');
  });

  it('returns the same label for a repeated name', () => {
    expect(guessCarClass('Mercedes GT3 2020')).toBe('GT3');
    expect(guessCarClass('Mercedes GT3 2020')).toBe('GT3');
  });
});
