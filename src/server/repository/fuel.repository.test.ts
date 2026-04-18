import { beforeEach, describe, expect, it } from 'vitest';
import {
  getLastLapFuelDelta,
  getMedianFuelPerLap,
  resetFuelTracking,
  updateFuelTracking,
} from '#repository/fuel.repository.ts';
import {
  getMedianLapTime,
  resetLapTimeTracking,
  updateLapTimeTracking,
} from '#repository/lap.repository.ts';

const PLAYER = 0;

// Helper: simulate player crossing a lap line
const tick = async (lap: number, fuel: number, lapTimes: number[] = []) => {
  const lapsCompleted = Array(64).fill(lap);
  const lastLapTimes = lapTimes.length > 0 ? lapTimes : Array(64).fill(0);
  updateFuelTracking(fuel, lap);
  await updateLapTimeTracking(lapsCompleted, lastLapTimes);
};

beforeEach(() => {
  resetFuelTracking();
  resetLapTimeTracking();
});

describe('getMedianFuelPerLap', () => {
  it('returns null before any crossing', () => {
    expect(getMedianFuelPerLap()).toBeNull();
  });

  it('returns null with only one sample (no delta yet)', async () => {
    await tick(0, 50);
    expect(getMedianFuelPerLap()).toBeNull();
  });

  it('returns median over valid deltas', async () => {
    await tick(0, 50);
    await tick(1, 48); // delta 2
    await tick(2, 46); // delta 2
    await tick(3, 44); // delta 2
    await tick(4, 41); // delta 3
    // sorted deltas: [2, 2, 2, 3] → median = 2
    expect(getMedianFuelPerLap()).toBe(2);
  });

  it('excludes negative deltas (pit refuel)', async () => {
    await tick(0, 50);
    await tick(1, 48); // delta 2
    await tick(2, 100); // delta -52 (refuel) — excluded
    await tick(3, 98); // delta 2
    await tick(4, 96); // delta 2
    // fuelDeltas (positive only): [2, 2, 2] → median = 2
    expect(getMedianFuelPerLap()).toBe(2);
  });

  it('pit lap outlier absorbed by median', async () => {
    await tick(0, 50);
    await tick(1, 48); // delta 2
    await tick(2, 46); // delta 2
    await tick(3, 44); // delta 2
    await tick(4, 42); // delta 2
    await tick(5, 32); // delta 10 (outlier)
    expect(getMedianFuelPerLap()).toBe(2);
  });
});

describe('getLastLapFuelDelta', () => {
  it('returns null with fewer than 2 samples', async () => {
    await tick(0, 50);
    expect(getLastLapFuelDelta()).toBeNull();
  });

  it('returns fuel consumed on the last lap', async () => {
    await tick(0, 50);
    await tick(1, 48);
    await tick(2, 45);
    expect(getLastLapFuelDelta()).toBe(3);
  });

  it('returns null on pit refuel lap', async () => {
    await tick(0, 50);
    await tick(1, 48);
    await tick(2, 100); // refuel
    expect(getLastLapFuelDelta()).toBeNull();
  });
});

describe('getMedianLapTime', () => {
  it('returns null for unknown car', () => {
    expect(getMedianLapTime(99)).toBeNull();
  });

  it('ignores lap time of 0', async () => {
    await tick(1, 50, Array(64).fill(0));
    expect(getMedianLapTime(PLAYER)).toBeNull();
  });

  it('returns median of lap times', async () => {
    await tick(1, 50, Array(64).fill(90));
    await tick(2, 48, Array(64).fill(92));
    await tick(3, 46, Array(64).fill(91));
    await tick(4, 44, Array(64).fill(89));
    await tick(5, 42, Array(64).fill(90));
    // sorted: [89, 90, 90, 91, 92] → median = 90
    expect(getMedianLapTime(PLAYER)).toBe(90);
  });

  it('pit lap outlier absorbed by median', async () => {
    await tick(1, 50, Array(64).fill(90));
    await tick(2, 48, Array(64).fill(90));
    await tick(3, 46, Array(64).fill(150)); // pit lap
    await tick(4, 44, Array(64).fill(91));
    await tick(5, 42, Array(64).fill(90));
    expect(getMedianLapTime(PLAYER)).toBe(90);
  });
});
