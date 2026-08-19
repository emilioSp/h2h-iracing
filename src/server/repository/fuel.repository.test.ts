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
  it('When one fuel sample has no consumption delta then the median is null', () => {
    recordLapStart(0, 50);

    expect(getMedianFuelPerLap()).toBeNull();
  });

  it('When four valid fuel deltas are recorded then their median is returned', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48);
    recordLapStart(2, 46);
    recordLapStart(3, 44);
    recordLapStart(4, 41);

    expect(getMedianFuelPerLap()).toBe(2);
  });

  it('When fuel increases during a pit stop then the refuel delta is excluded', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48);
    recordLapStart(2, 100);
    recordLapStart(3, 98);
    recordLapStart(4, 96);

    expect(getMedianFuelPerLap()).toBe(2);
  });

  it('When one lap consumes much more fuel then the median absorbs the outlier', () => {
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
  it('When two lap starts are recorded then both samples are returned', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48);

    expect(getFuelSamples()).toEqual([
      { lapNumber: 0, fuelAtLapStart: 50 },
      { lapNumber: 1, fuelAtLapStart: 48 },
    ]);
  });

  it('When fuel tracking is reset then recorded samples are cleared', () => {
    recordLapStart(0, 50);

    resetFuelTracking();

    expect(getFuelSamples()).toEqual([]);
  });
});

describe('getLastLapFuelDelta', () => {
  it('When one fuel sample has no consumption delta then the last delta is null', () => {
    recordLapStart(0, 50);

    expect(getLastLapFuelDelta()).toBeNull();
  });

  it('When three lap starts are recorded then the latest consumption is returned', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48);
    recordLapStart(2, 45);

    expect(getLastLapFuelDelta()).toBe(3);
  });

  it('When fuel increases on the latest lap then the last delta is null', () => {
    recordLapStart(0, 50);
    recordLapStart(1, 48);
    recordLapStart(2, 100);

    expect(getLastLapFuelDelta()).toBeNull();
  });
});
