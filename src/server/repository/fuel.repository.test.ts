import { beforeEach, describe, expect, it } from 'vitest';
import {
  getFuelSamples,
  getLastLapFuelDelta,
  getMedianFuelPerLap,
  resetFuelTracking,
  updateFuelTracking,
} from '#repository/fuel.repository.ts';

const tick = (lap: number, fuel: number) => {
  updateFuelTracking(fuel, lap);
};

beforeEach(() => {
  resetFuelTracking();
});

describe('getMedianFuelPerLap', () => {
  it('returns null before any crossing', () => {
    expect(getMedianFuelPerLap()).toBeNull();
  });

  it('returns null with only one sample (no delta yet)', () => {
    tick(0, 50);
    expect(getMedianFuelPerLap()).toBeNull();
  });

  it('returns median over valid deltas', () => {
    tick(0, 50);
    tick(1, 48); // delta 2
    tick(2, 46); // delta 2
    tick(3, 44); // delta 2
    tick(4, 41); // delta 3
    // sorted deltas: [2, 2, 2, 3] → median = 2
    expect(getMedianFuelPerLap()).toBe(2);
  });

  it('excludes negative deltas (pit refuel)', () => {
    tick(0, 50);
    tick(1, 48); // delta 2
    tick(2, 100); // delta -52 (refuel) — excluded
    tick(3, 98); // delta 2
    tick(4, 96); // delta 2
    // fuelDeltas (positive only): [2, 2, 2] → median = 2
    expect(getMedianFuelPerLap()).toBe(2);
  });

  it('pit lap outlier absorbed by median', () => {
    tick(0, 50);
    tick(1, 48); // delta 2
    tick(2, 46); // delta 2
    tick(3, 44); // delta 2
    tick(4, 42); // delta 2
    tick(5, 32); // delta 10 (outlier)
    expect(getMedianFuelPerLap()).toBe(2);
  });
});

describe('getFuelSamples', () => {
  it('returns empty array initially', () => {
    expect(getFuelSamples()).toEqual([]);
  });

  it('returns current samples after tracking', () => {
    tick(0, 50);
    tick(1, 48);
    expect(getFuelSamples()).toEqual([
      { lapNumber: 0, fuelAtLapStart: 50 },
      { lapNumber: 1, fuelAtLapStart: 48 },
    ]);
  });

  it('clears after reset', () => {
    tick(0, 50);
    resetFuelTracking();
    expect(getFuelSamples()).toEqual([]);
  });
});

describe('getLastLapFuelDelta', () => {
  it('returns null with fewer than 2 samples', () => {
    tick(0, 50);
    expect(getLastLapFuelDelta()).toBeNull();
  });

  it('returns fuel consumed on the last lap', () => {
    tick(0, 50);
    tick(1, 48);
    tick(2, 45);
    expect(getLastLapFuelDelta()).toBe(3);
  });

  it('returns null on pit refuel lap', () => {
    tick(0, 50);
    tick(1, 48);
    tick(2, 100); // refuel
    expect(getLastLapFuelDelta()).toBeNull();
  });
});
