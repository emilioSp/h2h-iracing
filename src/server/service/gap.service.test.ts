import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getGap } from '#service/gap.service.ts';

vi.mock('#repository/irsdk.repository.ts', () => ({
  getLapDistPct: vi.fn(),
  getOnPitRoad: vi.fn(),
  getLaps: vi.fn(),
  getEstTime: vi.fn(),
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
import {
  addRecentLap,
  type ReferenceLap,
} from '#repository/reference-lap.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import { getClassEstLapTime } from '#service/driver.service.ts';
import {
  getReferenceInterval,
  initReferenceInterval,
  normalizeTrackPct,
  resetReferenceLaps,
} from '#service/reference-lap.service.ts';

const mockGetLapDistancePercentage = vi.mocked(getLapDistPct);
const mockGetOnPitRoad = vi.mocked(getOnPitRoad);
const mockGetLaps = vi.mocked(getLaps);
const mockGetEstTime = vi.mocked(getEstTime);
const mockGetClassEstLapTime = vi.mocked(getClassEstLapTime);

const makeCar = (carIdx: number): Car => ({
  driver: {
    carIdx,
    name: '',
    carNumber: '',
    car: '',
    iRating: 0,
    license: '',
    classEstLapTime: 0,
  },
  position: 0,
  lastLapTime: 0,
  bestLapTime: 0,
  lap: 0,
});

const makeReferenceLap = (): ReferenceLap => {
  const startTime = 0;
  const finishTime = 90;
  const interval = getReferenceInterval();
  const lapTime = finishTime - startTime;
  return {
    startTime,
    finishTime,
    refPoints: new Map([
      [
        normalizeTrackPct(0.02),
        { trackPct: 0.02, timeElapsedSinceStart: 0.02 * lapTime },
      ],
      [
        normalizeTrackPct(0.02 + interval),
        {
          trackPct: 0.02 + interval,
          timeElapsedSinceStart: (0.02 + interval) * lapTime,
        },
      ],
      [
        normalizeTrackPct(0.1),
        { trackPct: 0.1, timeElapsedSinceStart: 0.1 * lapTime },
      ],
      [
        normalizeTrackPct(0.1 + interval),
        {
          trackPct: 0.1 + interval,
          timeElapsedSinceStart: (0.1 + interval) * lapTime,
        },
      ],
      [
        normalizeTrackPct(0.3),
        { trackPct: 0.3, timeElapsedSinceStart: 0.3 * lapTime },
      ],
      [
        normalizeTrackPct(0.3 + interval),
        {
          trackPct: 0.3 + interval,
          timeElapsedSinceStart: (0.3 + interval) * lapTime,
        },
      ],
      [
        normalizeTrackPct(0.5),
        { trackPct: 0.5, timeElapsedSinceStart: 0.5 * lapTime },
      ],
      [
        normalizeTrackPct(0.5 + interval),
        {
          trackPct: 0.5 + interval,
          timeElapsedSinceStart: (0.5 + interval) * lapTime,
        },
      ],
      [
        normalizeTrackPct(0.98),
        { trackPct: 0.98, timeElapsedSinceStart: 0.98 * lapTime },
      ],
      [
        normalizeTrackPct(0.98 + interval),
        {
          trackPct: 0.98 + interval,
          timeElapsedSinceStart: (0.98 + interval) * lapTime,
        },
      ],
    ]),
    lastTrackedPct: 0.99,
    isCleanLap: true,
  };
};

beforeEach(() => {
  vi.clearAllMocks();
  mockGetOnPitRoad.mockResolvedValue([0, 0]);
  mockGetLaps.mockResolvedValue([3, 3]);
  mockGetEstTime.mockResolvedValue([0, 0]);
  mockGetClassEstLapTime.mockResolvedValue(0);
  initReferenceInterval(5_000);
  resetReferenceLaps();
});

describe('getGap', () => {
  it('returns 0 seconds when both cars are the same', async () => {
    const { gapAhead, gapBehind } = await getGap(makeCar(0), makeCar(0), null);
    expect(gapAhead).toEqual({ value: 0, unit: 'seconds' });
    expect(gapBehind).toBeNull();
  });

  it('returns 0 seconds when no reference lap and no class est lap time', async () => {
    // player=car0 at 30%, ahead=car1 at 50%, behind=car2 at 10%
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5, 0.1]);
    mockGetLaps.mockResolvedValue([3, 3, 3]);
    mockGetClassEstLapTime.mockReturnValue(0);
    mockGetEstTime.mockResolvedValue([0, 0, 0]);

    const { gapAhead, gapBehind } = await getGap(
      makeCar(1),
      makeCar(0),
      makeCar(2),
    );
    expect(gapAhead).toEqual({ value: 0, unit: 'seconds' });
    expect(gapBehind).toEqual({ value: 0, unit: 'seconds' });
  });

  it('uses estimated delta when one of the cars is on pit road', async () => {
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetOnPitRoad.mockResolvedValue([0, 1]);
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([27, 45]);

    const { gapAhead, gapBehind } = await getGap(makeCar(1), makeCar(0), null);
    expect(gapAhead).toEqual({ value: 45 - 27, unit: 'seconds' });
    expect(gapBehind).toBeNull();
  });

  it('returns the time delta using the reference lap when all cars are on track', async () => {
    // player=car0 at 30%, ahead=car1 at 50%, behind=car2 at 10%
    // gapAhead uses car0's ref lap: (0.5 - 0.3) * 90 = 18s
    // gapBehind uses car2's ref lap: (0.3 - 0.1) * 90 = 18s
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5, 0.1]);
    mockGetOnPitRoad.mockResolvedValue([0, 0, 0]);
    mockGetLaps.mockResolvedValue([3, 3, 3]);
    addRecentLap(0, makeReferenceLap());
    addRecentLap(1, makeReferenceLap());
    addRecentLap(2, makeReferenceLap());

    const { gapAhead, gapBehind } = await getGap(
      makeCar(1),
      makeCar(0),
      makeCar(2),
    );
    expect(gapAhead).toEqual({ value: 18, unit: 'seconds' });
    expect(gapBehind).toEqual({ value: 18, unit: 'seconds' });
  });

  it('corrects gap when ahead car crossed finish line and gap exceeds half a lap', async () => {
    mockGetLapDistancePercentage.mockResolvedValue([0.5, 0.1]);
    mockGetLaps.mockResolvedValue([5, 6]); // --> car1 crossed the finish line for lap 5
    mockGetOnPitRoad.mockResolvedValue([0, 0]);
    addRecentLap(0, makeReferenceLap());

    const { gapAhead, gapBehind } = await getGap(makeCar(1), makeCar(0), null);
    expect(gapAhead?.unit).toBe('seconds');
    expect(gapAhead?.value).toBeCloseTo(54);
    expect(gapBehind).toBeNull();
  });

  it('uses estimated delta when behind car has completed fewer than 2 laps', async () => {
    // car 0 at 30%, car 1 at 50% → both on lap 1, car 0 is behind with only 1 lap completed
    mockGetLapDistancePercentage.mockResolvedValue([0.3, 0.5]);
    mockGetLaps.mockResolvedValue([1, 1]);
    addRecentLap(0, makeReferenceLap());
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([27, 45]);

    const { gapAhead, gapBehind } = await getGap(makeCar(1), makeCar(0), null);
    expect(gapAhead).toEqual({ value: 45 - 27, unit: 'seconds' });
    expect(gapBehind).toBeNull();
  });

  it('handles wrap-around with estimated delta', async () => {
    // car 0 just crossed finish (lap=1, pct=0.02), car 1 approaching (lap=0, pct=0.98)
    // total: car0=1.02, car1=0.98 → car 0 is ahead
    // estTime[ahead=0]=1.8, estTime[behind=1]=88.2 → delta = 1.8 - 88.2 = -86.4 → +90 → 3.6s
    mockGetLapDistancePercentage.mockResolvedValue([0.02, 0.98]);
    mockGetLaps.mockResolvedValue([1, 0]);
    mockGetClassEstLapTime.mockReturnValue(90);
    mockGetEstTime.mockResolvedValue([1.8, 88.2]);

    const { gapAhead, gapBehind } = await getGap(makeCar(0), makeCar(1), null);
    expect(gapAhead?.unit).toBe('seconds');
    expect(gapAhead?.value).toBeCloseTo(3.6);
    expect(gapBehind).toBeNull();
  });

  it('handles wrap-around when one car just crossed the finish line', async () => {
    // car 0 just crossed finish (lap=3, pct=0.02), car 1 approaching (lap=2, pct=0.98)
    // total: car0=3.02, car1=2.98 → car 0 is ahead
    // time at 2% ≈ 1.8s, time at 98% ≈ 88.2s → delta = 1.8 - 88.2 = -86.4 → +90 → 3.6s
    mockGetLapDistancePercentage.mockResolvedValue([0.02, 0.98]);
    mockGetLaps.mockResolvedValue([3, 2]);
    mockGetOnPitRoad.mockResolvedValue([0, 0]);
    addRecentLap(0, makeReferenceLap());
    addRecentLap(1, makeReferenceLap());

    const { gapAhead, gapBehind } = await getGap(null, makeCar(0), makeCar(1));
    expect(gapBehind?.unit).toBe('seconds');
    expect(gapBehind?.value).toBeCloseTo(3.6);
    expect(gapAhead).toBeNull();
  });

  it('returns laps when cars are multiple laps apart', async () => {
    // car 0 (player) on lap 1, car 1 (ahead) on lap 3 — both at same pct
    mockGetLapDistancePercentage.mockResolvedValue([0.5, 0.5, 0.5]);
    mockGetLaps.mockResolvedValue([3, 5, 1]);

    const { gapAhead, gapBehind } = await getGap(
      makeCar(1),
      makeCar(0),
      makeCar(2),
    );
    expect(gapAhead).toEqual({ value: 2, unit: 'laps' });
    expect(gapBehind).toEqual({ value: 2, unit: 'laps' });
  });

  it('returns seconds when laps differ by 1 but cars are close on track (wrap-around)', async () => {
    // ahead just crossed finish (lap=6, pct=0.02), behind approaching finish (lap=5, pct=0.98)
    mockGetLapDistancePercentage.mockResolvedValue([0.98, 0.02, 0.5]);
    mockGetLaps.mockResolvedValue([5, 6, 5]);
    mockGetOnPitRoad.mockResolvedValue([0, 0, 0]);
    addRecentLap(0, makeReferenceLap());
    addRecentLap(1, makeReferenceLap());
    addRecentLap(2, makeReferenceLap());

    const { gapAhead, gapBehind } = await getGap(
      makeCar(1),
      makeCar(0),
      makeCar(2),
    );
    expect(gapAhead?.unit).toBe('seconds');
    expect(gapAhead?.value).toBeCloseTo(3.6);
    expect(gapBehind?.unit).toBe('seconds');
    expect(gapBehind?.value).toBe(43.2);
  });
});
