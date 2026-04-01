import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('#repository/irsdk.repository.ts', () => ({
  getLapDistPct: vi.fn(),
  getSessionTime: vi.fn(),
  getTrackSurfaces: vi.fn(),
  getOnPitRoad: vi.fn(),
}));

import {
  getLapDistPct,
  getOnPitRoad,
  getSessionTime,
  getTrackSurfaces,
} from '#repository/irsdk.repository.ts';
import {
  addRecentLap,
  getActiveRefLap,
  getRefLap,
  type ReferenceLap,
  type ReferencePoint,
  resetReferenceLaps,
  setActiveRefLap,
} from '#repository/reference-lap.repository.ts';
import {
  getMinPointsForValidLap,
  getReferenceInterval,
  interpolateTimeAtTrackPosition,
  normalizeTrackPct,
  updateReferenceLaps,
} from '#service/reference-lap.service.ts';

const mockGetLapDistPct = vi.mocked(getLapDistPct);
const mockGetSessionTime = vi.mocked(getSessionTime);
const mockGetTrackSurfaces = vi.mocked(getTrackSurfaces);
const mockGetOnPitRoad = vi.mocked(getOnPitRoad);

const TRACK_SURFACE_ON_TRACK = 3;
const PAST_FINISH_LINE_PCT = 0.01;
const DEFAULT_TRACK_PCT = 0.5;
const DEFAULT_SESSION_TIME = 100;

const seedActiveLap = (
  carIdx: number,
  pointCount: number,
  opts?: Partial<ReferenceLap>,
): void => {
  const interval = getReferenceInterval();
  const refPoints = new Map<number, ReferencePoint>();
  for (let i = 0; i < pointCount; i++) {
    const pct = i * interval;
    refPoints.set(pct, {
      trackPct: pct,
      timeElapsedSinceStart: i,
    });
  }
  setActiveRefLap(carIdx, {
    startTime: 0,
    finishTime: -1,
    refPoints,
    lastTrackedPct: 0.97,
    isCleanLap: true,
    ...opts,
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  resetReferenceLaps();
  mockGetLapDistPct.mockResolvedValue([DEFAULT_TRACK_PCT]);
  mockGetSessionTime.mockResolvedValue(DEFAULT_SESSION_TIME);
  mockGetTrackSurfaces.mockResolvedValue([TRACK_SURFACE_ON_TRACK]);
  mockGetOnPitRoad.mockResolvedValue([0]);
});

describe('getRefLap', () => {
  it('returns null when no recent laps exist', () => {
    expect(getRefLap(0)).toBeNull();
  });

  it('returns the fastest lap in the recent window', () => {
    const slowLap: ReferenceLap = {
      startTime: 0,
      finishTime: 90,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    };
    const fastLap: ReferenceLap = {
      startTime: 0,
      finishTime: 80,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    };
    addRecentLap(0, slowLap);
    addRecentLap(0, fastLap);
    expect(getRefLap(0)).toBe(fastLap);
  });
});

describe('updateReferenceLaps', () => {
  it('skips cars with lapDistPct < 0', async () => {
    mockGetLapDistPct.mockResolvedValue([-1]);

    await updateReferenceLaps();

    expect(getActiveRefLap(0)).toBeNull();
  });

  it('initialises a new active lap on first data point', async () => {
    const sessionStart = 50;
    mockGetLapDistPct.mockResolvedValue([DEFAULT_TRACK_PCT]);
    mockGetSessionTime.mockResolvedValue(sessionStart);

    await updateReferenceLaps();

    const lap = getActiveRefLap(0);
    expect(lap).not.toBeNull();
    expect(lap?.startTime).toBe(sessionStart);
    expect(lap?.refPoints.size).toBe(1);
  });

  it('adds a refPoint to an existing active lap', async () => {
    const firstPct = 0.3;
    const secondPct = 0.6;
    mockGetLapDistPct.mockResolvedValue([firstPct]);
    await updateReferenceLaps();

    mockGetLapDistPct.mockResolvedValue([secondPct]);
    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.refPoints.size).toBe(2);
  });

  it('does not add a duplicate refPoint for the same normalised key', async () => {
    const samePct = 0.3;
    mockGetLapDistPct.mockResolvedValue([samePct]);
    await updateReferenceLaps();
    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.refPoints.size).toBe(1);
  });

  it('marks a clean lap dirty when the car enters pit road', async () => {
    const currentPct = 0.5;
    const nextPct = 0.6;
    const fewPoints = 5;
    seedActiveLap(0, fewPoints, {
      lastTrackedPct: currentPct,
      isCleanLap: true,
    });
    mockGetLapDistPct.mockResolvedValue([nextPct]);
    mockGetOnPitRoad.mockResolvedValue([1]);

    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.isCleanLap).toBe(false);
  });

  it('does not add refPoints on a dirty lap', async () => {
    const currentPct = 0.5;
    const nextPct = 0.9;
    const fewPoints = 5;
    seedActiveLap(0, fewPoints, {
      lastTrackedPct: currentPct,
      isCleanLap: false,
    });
    const sizeBefore = getActiveRefLap(0)?.refPoints.size ?? 0;

    mockGetLapDistPct.mockResolvedValue([nextPct]);
    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.refPoints.size).toBe(sizeBefore);
  });
});

describe('lap completion', async () => {
  it('resets active lap when lap wraps (lastTrackedPct > 0.95 → trackPct < 0.05)', async () => {
    const fewPoints = 5;
    const lapTime = 80;
    seedActiveLap(0, fewPoints);
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(lapTime);

    await updateReferenceLaps();

    const newLap = getActiveRefLap(0);
    expect(newLap?.startTime).toBe(lapTime);
    expect(newLap?.refPoints.size).toBe(1);
  });

  it('saves a valid clean lap to the recent window', async () => {
    const lapTime = 80;
    seedActiveLap(0, getMinPointsForValidLap());
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(lapTime);

    await updateReferenceLaps();

    expect(getRefLap(0)).not.toBeNull();
  });

  it('does not add to recent window when point count is below threshold', async () => {
    const lapTime = 80;
    seedActiveLap(0, getMinPointsForValidLap() - 1);
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(lapTime);

    await updateReferenceLaps();

    expect(getRefLap(0)).toBeNull();
  });

  it('does not add to recent window when lap is dirty', async () => {
    const lapTime = 80;
    seedActiveLap(0, getMinPointsForValidLap(), { isCleanLap: false });
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(lapTime);

    await updateReferenceLaps();

    expect(getRefLap(0)).toBeNull();
  });

  it('returns the faster lap when a new faster lap is added to the window', async () => {
    const existingLapTime = 90;
    const newLapTime = 80;
    const existingLap: ReferenceLap = {
      startTime: 0,
      finishTime: existingLapTime,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    };
    addRecentLap(0, existingLap);

    seedActiveLap(0, getMinPointsForValidLap());
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(newLapTime);

    await updateReferenceLaps();

    const ref = getRefLap(0);
    expect(ref?.finishTime).toBe(newLapTime);
    expect(ref?.startTime).toBe(0);
  });

  it('returns the faster lap when a new slower lap is added to the window', async () => {
    const existingLapTime = 80;
    const newLapTime = 90;
    const existingLap: ReferenceLap = {
      startTime: 0,
      finishTime: existingLapTime,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    };
    addRecentLap(0, existingLap);

    seedActiveLap(0, getMinPointsForValidLap());
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(newLapTime);

    await updateReferenceLaps();

    expect(getRefLap(0)).toBe(existingLap);
  });
});

describe('normalizeTrackPct', () => {
  it('returns 0 for key = 0', () => {
    expect(normalizeTrackPct(0)).toBe(0);
  });

  it('returns the key unchanged when it falls exactly on a boundary', () => {
    expect(normalizeTrackPct(getReferenceInterval())).toBe(
      getReferenceInterval(),
    );
  });

  it('truncates to the nearest referenceInterval boundary below', () => {
    const keyBetweenBoundaries = 0.003; // between 0.0025 and 0.005
    expect(normalizeTrackPct(keyBetweenBoundaries)).toBe(0.0025);
  });

  it('returns 0 for negative input', () => {
    expect(normalizeTrackPct(-0.1)).toBe(0);
  });
});

describe('interpolateTimeAtTrackPosition', () => {
  const makePoint = (trackPct: number, time: number): ReferencePoint => ({
    trackPct,
    timeElapsedSinceStart: time,
  });

  const makeLap = (
    points: Array<[number, ReferencePoint]>,
    startTime = 0,
    finishTime = 100,
  ): ReferenceLap => ({
    refPoints: new Map(points),
    startTime,
    finishTime,
    lastTrackedPct: points[points.length - 1]?.[0] ?? 0,
    isCleanLap: true,
  });

  it('returns null when no refPoint exists at the target position', () => {
    const lap = makeLap([[0.5, makePoint(0.5, 50)]]);
    expect(interpolateTimeAtTrackPosition(lap, 0.3)).toBeNull();
  });

  it('returns the p0 time when no next point exists', () => {
    const trackPct = 1 - getReferenceInterval();
    const time = 99.75;
    const lap = makeLap([[trackPct, makePoint(trackPct, time)]]);
    expect(interpolateTimeAtTrackPosition(lap, trackPct)).toBe(time);
  });

  it('linearly interpolates between two points', () => {
    const interval = getReferenceInterval();
    const lap = makeLap([
      [0.0, makePoint(0.0, 0)],
      [interval, makePoint(interval, 10)],
    ]);
    expect(interpolateTimeAtTrackPosition(lap, interval / 2)).toBeCloseTo(
      5,
      10,
    );
  });

  it('returns the stored time at an exact key', () => {
    const interval = getReferenceInterval();
    const lapTime = 100;
    const buckets = Math.floor(1 / interval);
    const entries: Array<[number, ReferencePoint]> = [];
    for (let i = 0; i < buckets; i++) {
      const pct = i * interval;
      entries.push([pct, makePoint(pct, pct * lapTime)]);
    }
    const lap = makeLap(entries, 0, lapTime);
    const storedPct = Math.floor(buckets / 2) * interval;
    expect(interpolateTimeAtTrackPosition(lap, storedPct)).toBeCloseTo(
      storedPct * lapTime,
      5,
    );
  });

  it('wraps time correctly when interpolating across the finish line', () => {
    const interval = getReferenceInterval();
    const lapTime = 100;
    const lastPct = 1 - interval;
    const lap = makeLap(
      [
        [lastPct, makePoint(lastPct, lastPct * lapTime)],
        [0, makePoint(0, 0)],
      ],
      0,
      lapTime,
    );
    const currentTrackPositionPct = lastPct + interval / 2;
    const expected = lastPct * lapTime + (interval / 2) * lapTime;
    expect(
      interpolateTimeAtTrackPosition(lap, currentTrackPositionPct),
    ).toBeCloseTo(expected, 3);
  });
});
