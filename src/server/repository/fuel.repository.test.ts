// Verifies fuel sample storage and consumption during regression tests.
import { beforeEach, describe, expect, it } from 'vitest';

import {
  getFuelSamples,
  getLastLapFuelDelta,
  getMedianFuelPerLap,
  resetFuelTracking,
  updateFuelTracking,
} from '#repository/fuel.repository.ts';

const recordLapStart = (lapNumber: number, fuelLevel: number) => {
  updateFuelTracking({ fuelLevel, playerLapCompleted: lapNumber });
};

beforeEach(() => {
  resetFuelTracking();
});

describe('getMedianFuelPerLap', () => {
  it('given one fuel sample has no consumption delta when median consumption is requested then the median is null', () => {
    recordLapStart(0, 50);

    expect(getMedianFuelPerLap()).toBeNull();
  });

  it('given four valid fuel deltas are recorded when median consumption is requested then their median is returned', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48);
    recordLapStart(2, 46);
    recordLapStart(3, 44);
    recordLapStart(4, 41);

    expect(getMedianFuelPerLap()).toBe(2);
  });

  it('given fuel increases during a pit stop when median consumption is requested then the refuel delta is excluded', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48);
    recordLapStart(2, 100);
    recordLapStart(3, 98);
    recordLapStart(4, 96);

    expect(getMedianFuelPerLap()).toBe(2);
  });

  it('given one lap consumes much more fuel when median consumption is requested then the median absorbs the outlier', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48); // delta 2
    recordLapStart(2, 46); // delta 2
    recordLapStart(3, 44); // delta 2
    recordLapStart(4, 42); // delta 2
    recordLapStart(5, 32); // delta 10 (outlier)

    expect(getMedianFuelPerLap()).toBe(2);
  });
});

describe('getFuelSamples', () => {
  it('given two lap starts are recorded when fuel samples are requested then both samples are returned', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48);

    expect(getFuelSamples()).toEqual([
      { lapNumber: 0, fuelAtLapStart: 50 },
      { lapNumber: 1, fuelAtLapStart: 48 },
    ]);
  });

  it('given fuel tracking is reset when fuel samples are requested then recorded samples are cleared', () => {
    recordLapStart(0, 50);

    resetFuelTracking();

    expect(getFuelSamples()).toEqual([]);
  });
});

describe('getLastLapFuelDelta', () => {
  it('given one fuel sample has no consumption delta when last lap consumption is requested then the last delta is null', () => {
    recordLapStart(0, 50);

    expect(getLastLapFuelDelta()).toBeNull();
  });

  it('given three lap starts are recorded when last lap consumption is requested then the latest consumption is returned', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48);
    recordLapStart(2, 45);

    expect(getLastLapFuelDelta()).toBe(3);
  });

  it('given fuel increases on the latest lap when last lap consumption is requested then the last delta is null', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48);
    recordLapStart(2, 100);

    expect(getLastLapFuelDelta()).toBeNull();
  });
});
