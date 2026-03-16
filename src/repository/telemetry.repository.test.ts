import { describe, expect, it } from 'vitest';
import {
  getBestLapTimes,
  getDriverInfo,
  getF2Times,
  getLaps,
  getLastLapTimes,
  getPlayerCarIdx,
  getPositions,
  getSessionTime,
  refreshTelemetry,
} from './telemetry.repository.ts';

describe('telemetry.repository', () => {
  it('reads player car index', () => {
    refreshTelemetry();
    expect(getPlayerCarIdx()).toBeGreaterThanOrEqual(0);
  });

  it('reads positions array', () => {
    expect(getPositions().length).toBeGreaterThan(0);
  });

  it('reads F2 times', () => {
    expect(getF2Times().length).toBeGreaterThan(0);
  });

  it('reads last and best lap times', () => {
    expect(getLastLapTimes().length).toBeGreaterThan(0);
    expect(getBestLapTimes().length).toBeGreaterThan(0);
  });

  it('reads laps', () => {
    expect(getLaps().length).toBeGreaterThan(0);
  });

  it('reads session time', () => {
    expect(getSessionTime()).toBeGreaterThan(0);
  });

  it('reads driver info for player', () => {
    const playerIdx = getPlayerCarIdx();
    const driver = getDriverInfo(playerIdx);

    expect(driver).not.toBeNull();
    expect(driver?.name).toBeTruthy();
    expect(driver?.iRating).toBeGreaterThan(0);
  });
});