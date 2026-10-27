// Verifies median lap time selection during regression tests.
import { beforeEach, describe, expect, it } from 'vitest';

import lapRepository from '#repository/lap.repository.ts';

const PLAYER_CAR_IDX = 0;

beforeEach(() => {
  lapRepository.resetLapTimeTracking();
});

describe('getMedianLapTime', () => {
  it('given no laps are recorded for a car when the median lap time is requested then its median lap time is null', () => {
    expect(lapRepository.getMedianLapTime(99)).toBeNull();
  });

  it('given iRacing reports a zero lap time when the median lap time is requested then the lap is excluded', () => {
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [1],
      lastLapTimes: [0],
    });

    expect(lapRepository.getMedianLapTime(PLAYER_CAR_IDX)).toBeNull();
  });

  it('given iRacing reports five valid lap times when the median lap time is requested then their median is returned', () => {
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [1],
      lastLapTimes: [90],
    });
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [2],
      lastLapTimes: [92],
    });
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [3],
      lastLapTimes: [91],
    });
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [4],
      lastLapTimes: [89],
    });
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [5],
      lastLapTimes: [90],
    });

    expect(lapRepository.getMedianLapTime(PLAYER_CAR_IDX)).toBe(90);
  });

  it('given iRacing reports one slow pit lap when the median lap time is requested then the median absorbs the outlier', () => {
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [1],
      lastLapTimes: [90],
    });
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [2],
      lastLapTimes: [90],
    });
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [3],
      lastLapTimes: [150],
    });
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [4],
      lastLapTimes: [91],
    });
    lapRepository.updateLapTimeTracking({
      carsIdx: [PLAYER_CAR_IDX],
      lapsCompleted: [5],
      lastLapTimes: [90],
    });

    expect(lapRepository.getMedianLapTime(PLAYER_CAR_IDX)).toBe(90);
  });
});
