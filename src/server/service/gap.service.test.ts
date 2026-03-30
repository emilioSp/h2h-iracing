import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getGap } from '#service/gap.service.ts';

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
  mockGetOnPitRoad.mockResolvedValue([0, 0, 0, 0, 0]);
  mockGetBestRefLap.mockResolvedValue(null);
  mockInterpolateAtPoint.mockResolvedValue(0);
  mockGetLaps.mockResolvedValue([2, 2, 2, 2, 2]);
  mockGetEstTime.mockResolvedValue([0, 0, 0, 0, 0]);
  mockGetClassEstLapTime.mockResolvedValue(0);
});

describe('getGap', () => {
  it('returns 0 when both cars are the same', async () => {
    expect(await getGap(2, 2)).toBe(0);
  });

  it('returns 0 when no reference lap and no class est lap time', async () => {
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetBestRefLap.mockReturnValue(null);
    mockGetClassEstLapTime.mockReturnValue(0);
    mockGetEstTime.mockResolvedValue([0, 0]);

    expect(await getGap(0, 1)).toBe(0);
  });

  it('uses estimated delta when one of the cars is on pit road', async () => {
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetOnPitRoad.mockResolvedValue([0, 1]);
    mockGetBestRefLap.mockReturnValue(makeReferenceLap());
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([27, 45]);

    expect(await getGap(0, 1)).toBe(45 - 27);
  });

  it('returns the time delta using the reference lap when both cars are on track', async () => {
    // car 0 at 30%, car 1 at 50% → car 1 is ahead, car 0 is the behind car whose reference lap is used
    const lapStartTime = 0;
    const lapFinishTime = 90;
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetOnPitRoad.mockResolvedValue([0, 0]);
    mockGetBestRefLap.mockReturnValue(
      makeReferenceLap(lapStartTime, lapFinishTime),
    );

    const timeAtCar0Position = 27;
    const timeAtCar1Position = 45;
    mockInterpolateAtPoint.mockImplementation((_, percentage) =>
      percentage === 0.3 ? timeAtCar0Position : timeAtCar1Position,
    );

    expect(await getGap(0, 1)).toBe(timeAtCar1Position - timeAtCar0Position);
  });

  it('corrects gap when raw delta exceeds half the lap duration', async () => {
    // car 1 ahead (50%), car 0 behind (30%) → timeAhead=80, timeBehind=0
    // raw delta=80 > lapTime/2=45 → corrected to |80-90|=10s
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetOnPitRoad.mockResolvedValue([0, 0]);
    mockGetBestRefLap.mockReturnValue(makeReferenceLap(0, 90));
    mockInterpolateAtPoint.mockImplementation((_, pct) =>
      pct === 0.5 ? 80 : 0,
    );

    expect(await getGap(0, 1)).toBe(10);
  });

  it('uses estimated delta when behind car has completed fewer than 2 laps', async () => {
    // car 0 at 30%, car 1 at 50% → car 0 is behind with only 1 lap completed
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetLaps.mockResolvedValue([1, 2]);
    mockGetBestRefLap.mockReturnValue(makeReferenceLap());
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([27, 45]);

    expect(await getGap(0, 1)).toBe(45 - 27);
  });

  it('uses estimated delta when behind car has 2+ laps but no ref lap', async () => {
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetLaps.mockResolvedValue([3, 3]);
    mockGetBestRefLap.mockReturnValue(null);
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([27, 45]);

    expect(await getGap(0, 1)).toBe(45 - 27);
  });

  it('uses reference delta when behind car has 2+ laps and ref lap exists', async () => {
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetLaps.mockResolvedValue([2, 2]);
    mockGetBestRefLap.mockReturnValue(makeReferenceLap(0, 90));
    mockInterpolateAtPoint.mockImplementation((_, pct) =>
      pct === 0.3 ? 27 : 45,
    );

    expect(await getGap(0, 1)).toBe(45 - 27);
  });

  it('handles wrap-around with estimated delta', async () => {
    // car 0 at 2% (just crossed finish), car 1 at 98% → car 0 is ahead, car 1 is behind
    // estTime[ahead=0]=1.8, estTime[behind=1]=88.2 → delta = 1.8 - 88.2 = -86.4 → +90 → 3.6s
    mockGetLapDistancePercentage.mockResolvedValue([0.02, 0.98]);
    mockGetLaps.mockResolvedValue([0, 0]);
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([1.8, 88.2]);

    expect(await getGap(0, 1)).toBeCloseTo(3.6);
  });

  it('handles wrap-around when one car just crossed the finish line', async () => {
    // car 0 at 2%, car 1 at 98% → raw relative = 0.96 > 0.5 → car 0 is actually ahead
    // car 1 is the behind car, so its reference lap is used
    // time at 98% is close to lap end, time at 2% is near lap start → large raw delta → wrap corrected
    const lapTime = 90;
    mockGetLapDistancePercentage.mockResolvedValue([0.02, 0.98]);
    mockGetOnPitRoad.mockResolvedValue([0, 0]);
    mockGetBestRefLap.mockReturnValue(makeReferenceLap(0, lapTime));

    const timeAtCar0Position = 1.8;
    const timeAtCar1Position = 88.2;
    mockInterpolateAtPoint.mockImplementation((_, percentage) =>
      percentage === 0.02 ? timeAtCar0Position : timeAtCar1Position,
    );

    // referenceDelta(aheadPct=0.02, behindPct=0.98): timeAhead=1.8, timeBehind=88.2
    // delta = 1.8 - 88.2 = -86.4 → +90 → 3.6s gap
    expect(await getGap(0, 1)).toBeCloseTo(3.6);
  });
});
