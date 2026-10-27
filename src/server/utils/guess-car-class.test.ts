// Verifies car class detection during regression tests.
import { describe, expect, it } from 'vitest';

import { carClass } from '#common/constants/car-class.ts';
import { guessCarClass } from '#server/utils/guess-car-class.ts';

describe('guessCarClass', () => {
  it.each([
    ['Ferrari 296 GT3', carClass.GT3],
    ['Ford Mustang GT4', carClass.GT4],
    ['Dallara F3', carClass.F3],
    ['Porsche 911 Cup (992.2)', carClass.PCUP],
    ['Ford GT GTE', carClass.GTE],
    ['Aston Martin DBR9 GT1', carClass.GT1],
    ['Dallara P217 LMP2', carClass.LMP2],
  ])('given the car name %s when its class is resolved then it is %s', (car, expected) => {
    expect(guessCarClass(car)).toBe(expected);
  });

  it.each(['Acura ARX-06', 'Ferrari 499P', 'Porsche 963'])(
    'given the car name %s without a recognized class when its class is resolved then it is GTP',
    (car) => {
      expect(guessCarClass(car)).toBe(carClass.GTP);
    },
  );

  it('given a GT3 R car name when its class is resolved then it is GT3', () => {
    expect(guessCarClass('Porsche 911 GT3 R (992)')).toBe(carClass.GT3);
  });

  it('given a car name containing GT3 and Cup when its class is resolved then it is PCUP', () => {
    expect(guessCarClass('Porsche 911 GT3 Cup (992)')).toBe(carClass.PCUP);
  });

  it('given a GT30000 car name when its class is resolved then it falls back to GTP', () => {
    expect(guessCarClass('Ferrari GT30000')).toBe(carClass.GTP);
  });
});
