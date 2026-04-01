import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getGap } from '#service/gap.service.ts';

vi.mock('#repository/irsdk.repository.ts', () => ({
  getLapDistPct: vi.fn(),
  getOnPitRoad: vi.fn(),
  getLaps: vi.fn(),
  getEstTime: vi.fn(),
}));

vi.mock('#repository/reference-lap.repository.ts', () => ({
  getRefLap: vi.fn(),
}));

vi.mock('#service/reference-lap.service.ts', () => ({
  interpolateTimeAtTrackPosition: vi.fn(),
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
import { getRefLap } from '#repository/reference-lap.repository.ts';
import { getClassEstLapTime } from '#service/driver.service.ts';
import { interpolateTimeAtTrackPosition } from '#service/reference-lap.service.ts';

const mockGetLapDistancePercentage = vi.mocked(getLapDistPct);
const mockGetOnPitRoad = vi.mocked(getOnPitRoad);
const mockGetLaps = vi.mocked(getLaps);
const mockGetEstTime = vi.mocked(getEstTime);
const mockGetRefLap = vi.mocked(getRefLap);
const mockInterpolateAtPoint = vi.mocked(interpolateTimeAtTrackPosition);
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
  mockGetRefLap.mockReturnValue(null);
  mockInterpolateAtPoint.mockResolvedValue(0);
  mockGetLaps.mockResolvedValue([2, 2, 2, 2, 2]);
  mockGetEstTime.mockResolvedValue([0, 0, 0, 0, 0]);
  mockGetClassEstLapTime.mockResolvedValue(0);
});

describe('getGap', () => {
  it('returns 0 seconds when both cars are the same', async () => {
    expect(await getGap(2, 2)).toEqual({ value: 0, unit: 'seconds' });
  });

  it('returns 0 seconds when no reference lap and no class est lap time', async () => {
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetRefLap.mockReturnValue(null);
    mockGetClassEstLapTime.mockReturnValue(0);
    mockGetEstTime.mockResolvedValue([0, 0]);

    expect(await getGap(0, 1)).toEqual({ value: 0, unit: 'seconds' });
  });

  it('uses estimated delta when one of the cars is on pit road', async () => {
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetOnPitRoad.mockResolvedValue([0, 1]);
    mockGetRefLap.mockReturnValue(makeReferenceLap());
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([27, 45]);

    expect(await getGap(0, 1)).toEqual({ value: 45 - 27, unit: 'seconds' });
  });

  it('returns the time delta using the reference lap when both cars are on track', async () => {
    // car 0 at 30%, car 1 at 50% → car 1 is ahead, car 0 is the behind car whose reference lap is used
    const lapStartTime = 0;
    const lapFinishTime = 90;
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetOnPitRoad.mockResolvedValue([0, 0]);
    mockGetRefLap.mockReturnValue(
      makeReferenceLap(lapStartTime, lapFinishTime),
    );

    const timeAtCar0Position = 27;
    const timeAtCar1Position = 45;
    mockInterpolateAtPoint.mockImplementation((_, percentage) =>
      percentage === 0.3 ? timeAtCar0Position : timeAtCar1Position,
    );

    expect(await getGap(0, 1)).toEqual({
      value: timeAtCar1Position - timeAtCar0Position,
      unit: 'seconds',
    });
  });

  it('corrects gap when ahead car crossed finish line and gap exceeds half a lap', async () => {
    // car 0 (behind) at 50% on lap 5, car 1 (ahead) at 10% on lap 6
    // real gap: 50% to finish + 10% of next lap = 60% of lap = 54s
    // without fix: delta = 9 - 45 = -36 → abs = 36s (WRONG, gap shrinks as ahead pulls away)
    // with fix: aheadPct (0.10) < behindPct (0.50) → delta += 90 → -36 + 90 = 54s (CORRECT)
    const lapTime = 90;
    mockGetLapDistancePercentage.mockResolvedValue([0.5, 0.1]);
    mockGetLaps.mockResolvedValue([5, 6]);
    mockGetOnPitRoad.mockResolvedValue([0, 0]);
    mockGetRefLap.mockReturnValue(makeReferenceLap(0, lapTime));
    mockInterpolateAtPoint.mockImplementation((_, pct) =>
      pct === 0.1 ? 9 : 45,
    );

    const result = await getGap(0, 1);
    expect(result.unit).toBe('seconds');
    expect(result.value).toBeCloseTo(54);
  });

  it('uses estimated delta when behind car has completed fewer than 2 laps', async () => {
    // car 0 at 30%, car 1 at 50% → both on lap 1, car 0 is behind with only 1 lap completed
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetLaps.mockResolvedValue([1, 1]);
    mockGetRefLap.mockReturnValue(makeReferenceLap());
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([27, 45]);

    expect(await getGap(0, 1)).toEqual({ value: 45 - 27, unit: 'seconds' });
  });

  it('uses estimated delta when behind car has 2+ laps but no ref lap', async () => {
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetLaps.mockResolvedValue([3, 3]);
    mockGetRefLap.mockReturnValue(null);
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([27, 45]);

    expect(await getGap(0, 1)).toEqual({ value: 45 - 27, unit: 'seconds' });
  });

  it('uses reference delta when behind car has 2+ laps and ref lap exists', async () => {
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetLaps.mockResolvedValue([2, 2]);
    mockGetRefLap.mockReturnValue(makeReferenceLap(0, 90));
    mockInterpolateAtPoint.mockImplementation((_, pct) =>
      pct === 0.3 ? 27 : 45,
    );

    expect(await getGap(0, 1)).toEqual({ value: 45 - 27, unit: 'seconds' });
  });

  it('handles wrap-around with estimated delta', async () => {
    // car 0 just crossed finish (lap=1, pct=0.02), car 1 approaching (lap=0, pct=0.98)
    // total: car0=1.02, car1=0.98 → car 0 is ahead
    // estTime[ahead=0]=1.8, estTime[behind=1]=88.2 → delta = 1.8 - 88.2 = -86.4 → +90 → 3.6s
    mockGetLapDistancePercentage.mockResolvedValue([0.02, 0.98]);
    mockGetLaps.mockResolvedValue([1, 0]);
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([1.8, 88.2]);

    const result = await getGap(0, 1);
    expect(result.unit).toBe('seconds');
    expect(result.value).toBeCloseTo(3.6);
  });

  it('handles wrap-around when one car just crossed the finish line', async () => {
    // car 0 just crossed finish (lap=3, pct=0.02), car 1 approaching (lap=2, pct=0.98)
    // total: car0=3.02, car1=2.98 → car 0 is ahead
    // time at 2% ≈ 1.8s, time at 98% ≈ 88.2s → delta = 1.8 - 88.2 = -86.4 → +90 → 3.6s
    const lapTime = 90;
    mockGetLapDistancePercentage.mockResolvedValue([0.02, 0.98]);
    mockGetLaps.mockResolvedValue([3, 2]);
    mockGetOnPitRoad.mockResolvedValue([0, 0]);
    mockGetRefLap.mockReturnValue(makeReferenceLap(0, lapTime));

    const timeAtCar0Position = 1.8;
    const timeAtCar1Position = 88.2;
    mockInterpolateAtPoint.mockImplementation((_, percentage) =>
      percentage === 0.02 ? timeAtCar0Position : timeAtCar1Position,
    );

    // referenceDelta(aheadPct=0.02, behindPct=0.98): timeAhead=1.8, timeBehind=88.2
    // delta = 1.8 - 88.2 = -86.4 → +90 → 3.6s gap
    const result = await getGap(0, 1);
    expect(result.unit).toBe('seconds');
    expect(result.value).toBeCloseTo(3.6);
  });

  it('returns laps when cars are multiple laps apart', async () => {
    // car 0 (player) on lap 1, car 1 (ahead) on lap 3 — both at same pct
    mockGetLapDistancePercentage.mockResolvedValue([0.5, 0.5]);
    mockGetLaps.mockResolvedValue([1, 3]);

    expect(await getGap(0, 1)).toEqual({ value: 2, unit: 'laps' });
  });

  it('returns seconds when laps differ by 1 but cars are close on track (wrap-around)', async () => {
    // ahead just crossed finish (lap=N+1, pct=0.02), behind approaching finish (lap=N, pct=0.98)
    // trueLapDiff = (N+1+0.02) - (N+0.98) = 0.04 → seconds
    const lapTime = 90;
    mockGetLapDistancePercentage.mockResolvedValue([0.98, 0.02]);
    mockGetLaps.mockResolvedValue([5, 6]);
    mockGetOnPitRoad.mockResolvedValue([0, 0]);
    mockGetRefLap.mockReturnValue(makeReferenceLap(0, lapTime));
    mockInterpolateAtPoint.mockImplementation((_, pct) =>
      pct === 0.02 ? 1.8 : 88.2,
    );

    const result = await getGap(0, 1);
    expect(result.unit).toBe('seconds');
    expect(result.value).toBeCloseTo(3.6);
  });
});
