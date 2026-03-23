import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getGap, getRelatives } from '#service/gap.service.ts';

vi.mock('#repository/irsdk.repository.ts', () => ({
  getLapDistPct: vi.fn(),
  getOnPitRoad: vi.fn(),
  getLaps: vi.fn(),
  getEstTime: vi.fn(),
}));

vi.mock('#repository/reference-lap.repository.ts', () => ({
  getBestRefLap: vi.fn(),
}));

vi.mock('#utils/pchip.ts', () => ({
  interpolateAtPoint: vi.fn(),
}));

vi.mock('#service/driver.service.ts', () => ({
  getClassEstLapTime: vi.fn(),
}));

import {
  getEstTime,
  getLapDistPct,
  getLaps,
  getOnPitRoad,
} from '#repository/irsdk.repository.ts';
import { getBestRefLap } from '#repository/reference-lap.repository.ts';
import { getClassEstLapTime } from '#service/driver.service.ts';
import { interpolateAtPoint } from '#utils/pchip.ts';

const mockGetLapDistancePercentage = vi.mocked(getLapDistPct);
const mockGetOnPitRoad = vi.mocked(getOnPitRoad);
const mockGetLaps = vi.mocked(getLaps);
const mockGetEstTime = vi.mocked(getEstTime);
const mockGetBestRefLap = vi.mocked(getBestRefLap);
const mockInterpolateAtPoint = vi.mocked(interpolateAtPoint);
const mockGetClassEstLapTime = vi.mocked(getClassEstLapTime);

const makeReferenceLap = (startTime = 0, finishTime = 90) => ({
  startTime,
  finishTime,
  refPoints: new Map(),
  lastTrackedPct: 0.99,
  isCleanLap: true,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockGetOnPitRoad.mockReturnValue([0, 0, 0, 0, 0]);
  mockGetBestRefLap.mockReturnValue(null);
  mockInterpolateAtPoint.mockReturnValue(0);
  mockGetLaps.mockReturnValue([2, 2, 2, 2, 2]);
  mockGetEstTime.mockReturnValue([0, 0, 0, 0, 0]);
  mockGetClassEstLapTime.mockReturnValue(0);
});

describe('getGap', () => {
  it('returns 0 when both cars are the same', () => {
    expect(getGap(2, 2)).toBe(0);
  });

  it('returns 0 when no reference lap and no class est lap time', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetBestRefLap.mockReturnValue(null);
    mockGetClassEstLapTime.mockReturnValue(0);
    mockGetEstTime.mockReturnValue([0, 0]);

    expect(getGap(0, 1)).toBe(0);
  });

  it('uses estimated delta when one of the cars is on pit road', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetOnPitRoad.mockReturnValue([0, 1]);
    mockGetBestRefLap.mockReturnValue(makeReferenceLap());
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockReturnValue([27, 45]);

    expect(getGap(0, 1)).toBe(45 - 27);
  });

  it('returns the time delta using the reference lap when both cars are on track', () => {
    // car 0 at 30%, car 1 at 50% → car 1 is ahead, car 0 is the behind car whose reference lap is used
    const lapStartTime = 0;
    const lapFinishTime = 90;
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetOnPitRoad.mockReturnValue([0, 0]);
    mockGetBestRefLap.mockReturnValue(
      makeReferenceLap(lapStartTime, lapFinishTime),
    );

    const timeAtCar0Position = 27;
    const timeAtCar1Position = 45;
    mockInterpolateAtPoint.mockImplementation((_, percentage) =>
      percentage === 0.3 ? timeAtCar0Position : timeAtCar1Position,
    );

    expect(getGap(0, 1)).toBe(timeAtCar1Position - timeAtCar0Position);
  });

  it('corrects gap when raw delta exceeds half the lap duration', () => {
    // car 1 ahead (50%), car 0 behind (30%) → timeAhead=80, timeBehind=0
    // raw delta=80 > lapTime/2=45 → corrected to |80-90|=10s
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetOnPitRoad.mockReturnValue([0, 0]);
    mockGetBestRefLap.mockReturnValue(makeReferenceLap(0, 90));
    mockInterpolateAtPoint.mockImplementation((_, pct) =>
      pct === 0.5 ? 80 : 0,
    );

    expect(getGap(0, 1)).toBe(10);
  });

  it('uses estimated delta when behind car has completed fewer than 2 laps', () => {
    // car 0 at 30%, car 1 at 50% → car 0 is behind with only 1 lap completed
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetLaps.mockReturnValue([1, 2]);
    mockGetBestRefLap.mockReturnValue(makeReferenceLap());
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockReturnValue([27, 45]);

    expect(getGap(0, 1)).toBe(45 - 27);
  });

  it('uses estimated delta when behind car has 2+ laps but no ref lap', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetLaps.mockReturnValue([3, 3]);
    mockGetBestRefLap.mockReturnValue(null);
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockReturnValue([27, 45]);

    expect(getGap(0, 1)).toBe(45 - 27);
  });

  it('uses reference delta when behind car has 2+ laps and ref lap exists', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetLaps.mockReturnValue([2, 2]);
    mockGetBestRefLap.mockReturnValue(makeReferenceLap(0, 90));
    mockInterpolateAtPoint.mockImplementation((_, pct) =>
      pct === 0.3 ? 27 : 45,
    );

    expect(getGap(0, 1)).toBe(45 - 27);
  });

  it('handles wrap-around with estimated delta', () => {
    // car 0 at 2% (just crossed finish), car 1 at 98% → car 0 is ahead, car 1 is behind
    // estTime[ahead=0]=1.8, estTime[behind=1]=88.2 → delta = 1.8 - 88.2 = -86.4 → +90 → 3.6s
    mockGetLapDistancePercentage.mockReturnValue([0.02, 0.98]);
    mockGetLaps.mockReturnValue([0, 0]);
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockReturnValue([1.8, 88.2]);

    expect(getGap(0, 1)).toBeCloseTo(3.6);
  });

  it('handles wrap-around when one car just crossed the finish line', () => {
    // car 0 at 2%, car 1 at 98% → raw relative = 0.96 > 0.5 → car 0 is actually ahead
    // car 1 is the behind car, so its reference lap is used
    // time at 98% is close to lap end, time at 2% is near lap start → large raw delta → wrap corrected
    const lapTime = 90;
    mockGetLapDistancePercentage.mockReturnValue([0.02, 0.98]);
    mockGetOnPitRoad.mockReturnValue([0, 0]);
    mockGetBestRefLap.mockReturnValue(makeReferenceLap(0, lapTime));

    const timeAtCar0Position = 1.8;
    const timeAtCar1Position = 88.2;
    mockInterpolateAtPoint.mockImplementation((_, percentage) =>
      percentage === 0.02 ? timeAtCar0Position : timeAtCar1Position,
    );

    // referenceDelta(aheadPct=0.02, behindPct=0.98): timeAhead=1.8, timeBehind=88.2
    // delta = 1.8 - 88.2 = -86.4 → +90 → 3.6s gap
    expect(getGap(0, 1)).toBeCloseTo(3.6);
  });
});

describe('getRelatives', () => {
  it('returns an empty array when the focus car has no lap distance data', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5, 0.6]);
    expect(getRelatives(5)).toEqual([]);
  });

  it('returns entries sorted from furthest ahead to furthest behind', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5, 0.6, 0.3]);
    mockGetBestRefLap.mockReturnValue(null);

    const result = getRelatives(0);
    const relativePercentages = result.map((entry) => entry.relativePct);

    expect(relativePercentages).toEqual(
      [...relativePercentages].sort((a, b) => b - a),
    );
  });

  it('includes the focus car with a relative percentage of 0', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5, 0.6]);
    mockGetBestRefLap.mockReturnValue(null);

    const result = getRelatives(0);
    const focusCarEntry = result.find((entry) => entry.carIdx === 0);

    expect(focusCarEntry).toBeDefined();
    expect(focusCarEntry?.relativePct).toBe(0);
  });

  it('excludes cars not in the activeCarIdxs set', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5, 0.6, 0.3]);
    mockGetBestRefLap.mockReturnValue(null);

    const result = getRelatives(0, 5, new Set([0, 2]));
    const carIndexes = result.map((entry) => entry.carIdx);

    expect(carIndexes).not.toContain(1);
    expect(carIndexes).toContain(2);
  });

  it('limits results to buffer entries on each side of the focus car', () => {
    // 7 cars spread across the track, focus is car 3, buffer=1 → at most 3 entries
    mockGetLapDistancePercentage.mockReturnValue([
      0.1, 0.2, 0.3, 0.5, 0.6, 0.7, 0.8,
    ]);
    mockGetBestRefLap.mockReturnValue(null);

    const result = getRelatives(3, 1);

    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('returns an empty array when the focus car is excluded by the activeCarIdxs filter', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5, 0.6]);

    const result = getRelatives(0, 5, new Set([1]));

    expect(result).toEqual([]);
  });
});
