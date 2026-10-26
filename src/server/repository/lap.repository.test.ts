// Verifies median lap time selection during regression tests.
import { beforeEach, describe, expect, it } from 'vitest';

import {
  getMedianLapTime,
  resetLapTimeTracking,
  updateLapTimeTracking,
} from '#repository/lap.repository.ts';

const PLAYER_CAR_IDX = 0;

const carsIdx = Array.from({ length: 64 }, (_, carIdx) => carIdx);

const recordLapTimes = ({ lapNumber, lapTime }: { lapNumber: number; lapTime: number }) => {
  updateLapTimeTracking({
    carsIdx,
    lapsCompleted: Array(64).fill(lapNumber),
    lastLapTimes: Array(64).fill(lapTime),
  });
};

beforeEach(() => {
  resetLapTimeTracking();
});

describe('getMedianLapTime', () => {
  it('given no laps are recorded for a car when the median lap time is requested then its median lap time is null', () => {
    expect(getMedianLapTime(99)).toBeNull();
  });

  it('given iRacing reports a zero lap time when the median lap time is requested then the lap is excluded', () => {
    recordLapTimes({ lapNumber: 1, lapTime: 0 });

    expect(getMedianLapTime(PLAYER_CAR_IDX)).toBeNull();
  });

  it('given iRacing reports five valid lap times when the median lap time is requested then their median is returned', () => {
    recordLapTimes({ lapNumber: 1, lapTime: 90 });
    recordLapTimes({ lapNumber: 2, lapTime: 92 });
    recordLapTimes({ lapNumber: 3, lapTime: 91 });
    recordLapTimes({ lapNumber: 4, lapTime: 89 });
    recordLapTimes({ lapNumber: 5, lapTime: 90 });

    expect(getMedianLapTime(PLAYER_CAR_IDX)).toBe(90);
  });

  it('given iRacing reports one slow pit lap when the median lap time is requested then the median absorbs the outlier', () => {
    recordLapTimes({ lapNumber: 1, lapTime: 90 });
    recordLapTimes({ lapNumber: 2, lapTime: 90 });
    recordLapTimes({ lapNumber: 3, lapTime: 150 });
    recordLapTimes({ lapNumber: 4, lapTime: 91 });
    recordLapTimes({ lapNumber: 5, lapTime: 90 });

    expect(getMedianLapTime(PLAYER_CAR_IDX)).toBe(90);
  });
});
