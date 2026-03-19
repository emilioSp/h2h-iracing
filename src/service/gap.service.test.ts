import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getGap, getRelatives } from '#service/gap.service.ts';

vi.mock('#repository/irsdk.repository.ts', () => ({
  getLapDistPct: vi.fn(),
  getOnPitRoad: vi.fn(),
}));

vi.mock('#repository/reference-lap.repository.ts', () => ({
  getBestLap: vi.fn(),
}));

vi.mock('#utils/pchip.ts', () => ({
  interpolateAtPoint: vi.fn(),
}));

import { getLapDistPct, getOnPitRoad } from '#repository/irsdk.repository.ts';
import { getBestLap } from '#repository/reference-lap.repository.ts';
import { interpolateAtPoint } from '#utils/pchip.ts';

const mockGetLapDistancePercentage = vi.mocked(getLapDistPct);
const mockGetOnPitRoad = vi.mocked(getOnPitRoad);
const mockGetBestLap = vi.mocked(getBestLap);
const mockInterpolateAtPoint = vi.mocked(interpolateAtPoint);

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
  mockGetBestLap.mockReturnValue(null);
  mockInterpolateAtPoint.mockReturnValue(0);
});

describe('getGap', () => {
  it('returns 0 when both cars are the same', () => {
    expect(getGap(2, 2)).toBe(0);
  });

  it('returns NaN when the first car has no lap distance data', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5]);
    expect(getGap(0, 5)).toBeNaN();
  });

  it('returns NaN when the second car has no lap distance data', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5]);
    expect(getGap(5, 0)).toBeNaN();
  });

  it('returns NaN when no reference lap is available', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetBestLap.mockReturnValue(null);

    expect(getGap(0, 1)).toBeNaN();
  });

  it('returns NaN when one of the cars is on pit road', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetOnPitRoad.mockReturnValue([0, 1]);
    mockGetBestLap.mockReturnValue(makeReferenceLap());

    expect(getGap(0, 1)).toBeNaN();
  });

  it('returns the time delta using the reference lap when both cars are on track', () => {
    // car 0 at 30%, car 1 at 50% → car 1 is ahead, car 0 is the behind car whose reference lap is used
    const lapStartTime = 0;
    const lapFinishTime = 90;
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetOnPitRoad.mockReturnValue([0, 0]);
    mockGetBestLap.mockReturnValue(
      makeReferenceLap(lapStartTime, lapFinishTime),
    );

    const timeAtCar0Position = 27;
    const timeAtCar1Position = 45;
    mockInterpolateAtPoint.mockImplementation((_, percentage) =>
      percentage === 0.3 ? timeAtCar0Position : timeAtCar1Position,
    );

    expect(getGap(0, 1)).toBe(timeAtCar1Position - timeAtCar0Position);
  });

  it('subtracts the lap time when the raw delta exceeds half the lap duration', () => {
    // delta of 80s on a 90s lap → exceeds the 45s half-lap threshold → corrected to 80 - 90 = -10
    const lapTime = 90;
    mockGetLapDistancePercentage.mockReturnValue([0.3, 0.5]);
    mockGetOnPitRoad.mockReturnValue([0, 0]);
    mockGetBestLap.mockReturnValue(makeReferenceLap(0, lapTime));
    mockInterpolateAtPoint.mockImplementation((_, percentage) =>
      percentage === 0.3 ? 0 : 80,
    );

    expect(getGap(0, 1)).toBe(80 - lapTime);
  });

  it('handles wrap-around when one car just crossed the finish line', () => {
    // car 0 at 2%, car 1 at 98% → raw relative = 0.96 > 0.5 → car 0 is actually ahead
    // car 1 is the behind car, so its reference lap is used
    // time at 98% is close to lap end, time at 2% is near lap start → large raw delta → wrap corrected
    const lapTime = 90;
    mockGetLapDistancePercentage.mockReturnValue([0.02, 0.98]);
    mockGetOnPitRoad.mockReturnValue([0, 0]);
    mockGetBestLap.mockReturnValue(makeReferenceLap(0, lapTime));

    const timeAtCar0Position = 1.8;
    const timeAtCar1Position = 88.2;
    mockInterpolateAtPoint.mockImplementation((_, percentage) =>
      percentage === 0.02 ? timeAtCar0Position : timeAtCar1Position,
    );

    const rawDelta = timeAtCar1Position - timeAtCar0Position; // 86.4 → exceeds half lap (45s)
    expect(getGap(0, 1)).toBe(rawDelta - lapTime); // -3.6
  });
});

describe('getRelatives', () => {
  it('returns an empty array when the focus car has no lap distance data', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5, 0.6]);
    expect(getRelatives(5)).toEqual([]);
  });

  it('returns entries sorted from furthest ahead to furthest behind', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5, 0.6, 0.3]);
    mockGetBestLap.mockReturnValue(null);

    const result = getRelatives(0);
    const relativePercentages = result.map((entry) => entry.relativePct);

    expect(relativePercentages).toEqual(
      [...relativePercentages].sort((a, b) => b - a),
    );
  });

  it('includes the focus car with a relative percentage of 0', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5, 0.6]);
    mockGetBestLap.mockReturnValue(null);

    const result = getRelatives(0);
    const focusCarEntry = result.find((entry) => entry.carIdx === 0);

    expect(focusCarEntry).toBeDefined();
    expect(focusCarEntry?.relativePct).toBe(0);
  });

  it('excludes cars not in the activeCarIdxs set', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5, 0.6, 0.3]);
    mockGetBestLap.mockReturnValue(null);

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
    mockGetBestLap.mockReturnValue(null);

    const result = getRelatives(3, 1);

    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('returns an empty array when the focus car is excluded by the activeCarIdxs filter', () => {
    mockGetLapDistancePercentage.mockReturnValue([0.5, 0.6]);

    const result = getRelatives(0, 5, new Set([1]));

    expect(result).toEqual([]);
  });
});
