import { beforeEach, describe, expect, it } from 'vitest';
import {
  getMedianLapTime,
  resetLapTimeTracking,
  updateLapTimeTracking,
} from '#repository/lap.repository.ts';

const PLAYER = 0;

const tick = async (lap: number, lapTimes: number[] = []) => {
  const lapsCompleted = Array(64).fill(lap);
  const lastLapTimes = lapTimes.length > 0 ? lapTimes : Array(64).fill(0);
  await updateLapTimeTracking(lapsCompleted, lastLapTimes);
};

beforeEach(() => {
  resetLapTimeTracking();
});

describe('getMedianLapTime', () => {
  it('returns null for unknown car', () => {
    expect(getMedianLapTime(99)).toBeNull();
  });

  it('ignores lap time of 0', async () => {
    await tick(1, Array(64).fill(0));
    expect(getMedianLapTime(PLAYER)).toBeNull();
  });

  it('returns median of lap times', async () => {
    await tick(1, Array(64).fill(90));
    await tick(2, Array(64).fill(92));
    await tick(3, Array(64).fill(91));
    await tick(4, Array(64).fill(89));
    await tick(5, Array(64).fill(90));
    // sorted: [89, 90, 90, 91, 92] → median = 90
    expect(getMedianLapTime(PLAYER)).toBe(90);
  });

  it('pit lap outlier absorbed by median', async () => {
    await tick(1, Array(64).fill(90));
    await tick(2, Array(64).fill(90));
    await tick(3, Array(64).fill(150)); // pit lap
    await tick(4, Array(64).fill(91));
    await tick(5, Array(64).fill(90));
    expect(getMedianLapTime(PLAYER)).toBe(90);
  });
});
