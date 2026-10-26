// Verifies car class detection during regression tests.
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
  ])('given the car name %s when its class is resolved then it is %s', (car, expected) => {
    expect(guessCarClass(car)).toBe(expected);
  });

  it.each(['Acura ARX-06', 'Ferrari 499P', 'Porsche 963'])(
    'given the car name %s without a recognized class when its class is resolved then it is GTP',
    (car) => {
      expect(guessCarClass(car)).toBe('GTP');
    },
  );

  it('given a GT3 R car name when its class is resolved then it is GT3', () => {
    expect(guessCarClass('Porsche 911 GT3 R (992)')).toBe('GT3');
  });

  it('given a car name containing GT3 and Cup when its class is resolved then it is PCUP', () => {
    expect(guessCarClass('Porsche 911 GT3 Cup (992)')).toBe('PCUP');
  });

  it('given a GT30000 car name when its class is resolved then it falls back to GTP', () => {
    expect(guessCarClass('Ferrari GT30000')).toBe('GTP');
  });

  it('given a previously resolved GT3 car name when its class is resolved again then it is GT3', () => {
    guessCarClass('Mercedes GT3 2020');

    expect(guessCarClass('Mercedes GT3 2020')).toBe('GT3');
  });
});
