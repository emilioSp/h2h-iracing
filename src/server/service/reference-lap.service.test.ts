import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('#repository/irsdk.repository.ts', () => ({
  getLapDistPct: vi.fn(),
  getSessionTime: vi.fn(),
  getTrackSurfaces: vi.fn(),
  getOnPitRoad: vi.fn(),
}));

vi.mock('#utils/pchip.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#utils/pchip.ts')>();
  return { ...actual, precomputePCHIPTangents: vi.fn() };
});

import {
  getLapDistPct,
  getOnPitRoad,
  getSessionTime,
  getTrackSurfaces,
} from '#repository/irsdk.repository.ts';
import {
  getActiveRefLap,
  getBestRefLap,
  type ReferenceLap,
  type ReferencePoint,
  resetReferenceLaps,
  setActiveRefLap,
  setBestRefLap,
} from '#repository/reference-lap.repository.ts';
import {
  getBestRefLapTime,
  updateReferenceLaps,
} from '#service/reference-lap.service.ts';
import { precomputePCHIPTangents, REFERENCE_INTERVAL } from '#utils/pchip.ts';

const mockGetLapDistPct = vi.mocked(getLapDistPct);
const mockGetSessionTime = vi.mocked(getSessionTime);
const mockGetTrackSurfaces = vi.mocked(getTrackSurfaces);
const mockGetOnPitRoad = vi.mocked(getOnPitRoad);
const mockPrecomputePCHIPTangents = vi.mocked(precomputePCHIPTangents);

const TRACK_SURFACE_ON_TRACK = 3;
const MIN_VALID_POINTS = 400;
const PAST_FINISH_LINE_PCT = 0.01;
const DEFAULT_TRACK_PCT = 0.5;
const DEFAULT_SESSION_TIME = 100;

const seedActiveLap = (
  carIdx: number,
  pointCount: number,
  opts?: Partial<ReferenceLap>,
): void => {
  const refPoints = new Map<number, ReferencePoint>();
  for (let i = 0; i < pointCount; i++) {
    const pct = i * REFERENCE_INTERVAL;
    refPoints.set(pct, {
      trackPct: pct,
      timeElapsedSinceStart: i,
      tangent: undefined,
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

describe('getBestRefLapTime', () => {
  it('returns NaN when no best lap exists', () => {
    expect(getBestRefLapTime(0)).toBeNaN();
  });

  it('returns the lap time of the best lap', () => {
    setBestRefLap(0, {
      startTime: 100,
      finishTime: 180,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    });
    expect(getBestRefLapTime(0)).toBe(80);
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

  it('saves a clean fast lap as best lap', async () => {
    const lapTime = 80;
    seedActiveLap(0, MIN_VALID_POINTS);
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(lapTime);

    await updateReferenceLaps();

    expect(getBestRefLap(0)).not.toBeNull();
    expect(mockPrecomputePCHIPTangents).toHaveBeenCalledOnce();
  });

  it('does not save best lap when point count < 400', async () => {
    const lapTime = 80;
    seedActiveLap(0, MIN_VALID_POINTS - 1);
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(lapTime);

    await updateReferenceLaps();

    expect(getBestRefLap(0)).toBeNull();
    expect(mockPrecomputePCHIPTangents).not.toHaveBeenCalled();
  });

  it('does not save best lap when lap is dirty', async () => {
    const lapTime = 80;
    seedActiveLap(0, MIN_VALID_POINTS, { isCleanLap: false });
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(lapTime);

    await updateReferenceLaps();

    expect(getBestRefLap(0)).toBeNull();
  });

  it('replaces best lap when new lap is faster', async () => {
    const existingBestLapTime = 90;
    const newLapTime = 80;
    const existingBest: ReferenceLap = {
      startTime: 0,
      finishTime: existingBestLapTime,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    };
    setBestRefLap(0, existingBest);

    seedActiveLap(0, MIN_VALID_POINTS);
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(newLapTime);

    await updateReferenceLaps();

    const best = getBestRefLap(0);
    expect(best?.finishTime).toBe(newLapTime);
    expect(best?.startTime).toBe(0);
  });

  it('keeps existing best lap when new lap is slower', async () => {
    const existingBestLapTime = 80;
    const newLapTime = 90;
    const existingBest: ReferenceLap = {
      startTime: 0,
      finishTime: existingBestLapTime,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    };
    setBestRefLap(0, existingBest);

    seedActiveLap(0, MIN_VALID_POINTS);
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(newLapTime);

    await updateReferenceLaps();

    expect(getBestRefLap(0)).toBe(existingBest);
  });

  it('does not replace best lap when new lap is equal (not strictly faster)', async () => {
    const lapTime = 80;
    const existingBest: ReferenceLap = {
      startTime: 0,
      finishTime: lapTime,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    };
    setBestRefLap(0, existingBest);

    seedActiveLap(0, MIN_VALID_POINTS);
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(lapTime);

    await updateReferenceLaps();

    expect(getBestRefLap(0)).toBe(existingBest);
  });
});
