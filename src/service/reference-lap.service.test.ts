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
  getActiveLap,
  getBestLap,
  type ReferenceLap,
  type ReferencePoint,
  resetReferenceLaps,
  setActiveLap,
  setBestLap,
} from '#repository/reference-lap.repository.ts';
import { precomputePCHIPTangents, REFERENCE_INTERVAL } from '#utils/pchip.ts';
import { updateReferenceLaps } from '#service/reference-lap.service.ts';

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
  setActiveLap(carIdx, {
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
  mockGetLapDistPct.mockReturnValue([DEFAULT_TRACK_PCT]);
  mockGetSessionTime.mockReturnValue(DEFAULT_SESSION_TIME);
  mockGetTrackSurfaces.mockReturnValue([TRACK_SURFACE_ON_TRACK]);
  mockGetOnPitRoad.mockReturnValue([0]);
});

describe('updateReferenceLaps', () => {
  it('skips cars with lapDistPct < 0', () => {
    mockGetLapDistPct.mockReturnValue([-1]);

    updateReferenceLaps();

    expect(getActiveLap(0)).toBeNull();
  });

  it('initialises a new active lap on first data point', () => {
    const sessionStart = 50;
    mockGetLapDistPct.mockReturnValue([DEFAULT_TRACK_PCT]);
    mockGetSessionTime.mockReturnValue(sessionStart);

    updateReferenceLaps();

    const lap = getActiveLap(0);
    expect(lap).not.toBeNull();
    expect(lap?.startTime).toBe(sessionStart);
    expect(lap?.refPoints.size).toBe(1);
  });

  it('adds a refPoint to an existing active lap', () => {
    const firstPct = 0.3;
    const secondPct = 0.6;
    mockGetLapDistPct.mockReturnValue([firstPct]);
    updateReferenceLaps();

    mockGetLapDistPct.mockReturnValue([secondPct]);
    updateReferenceLaps();

    expect(getActiveLap(0)?.refPoints.size).toBe(2);
  });

  it('does not add a duplicate refPoint for the same normalised key', () => {
    const samePct = 0.3;
    mockGetLapDistPct.mockReturnValue([samePct]);
    updateReferenceLaps();
    updateReferenceLaps();

    expect(getActiveLap(0)?.refPoints.size).toBe(1);
  });

  it('marks a clean lap dirty when the car enters pit road', () => {
    const currentPct = 0.5;
    const nextPct = 0.6;
    const fewPoints = 5;
    seedActiveLap(0, fewPoints, {
      lastTrackedPct: currentPct,
      isCleanLap: true,
    });
    mockGetLapDistPct.mockReturnValue([nextPct]);
    mockGetOnPitRoad.mockReturnValue([1]);

    updateReferenceLaps();

    expect(getActiveLap(0)?.isCleanLap).toBe(false);
  });

  it('does not add refPoints on a dirty lap', () => {
    const currentPct = 0.5;
    const nextPct = 0.9;
    const fewPoints = 5;
    seedActiveLap(0, fewPoints, {
      lastTrackedPct: currentPct,
      isCleanLap: false,
    });
    const sizeBefore = getActiveLap(0)?.refPoints.size ?? 0;

    mockGetLapDistPct.mockReturnValue([nextPct]);
    updateReferenceLaps();

    expect(getActiveLap(0)?.refPoints.size).toBe(sizeBefore);
  });
});

describe('lap completion', () => {
  it('resets active lap when lap wraps (lastTrackedPct > 0.95 → trackPct < 0.05)', () => {
    const fewPoints = 5;
    const lapTime = 80;
    seedActiveLap(0, fewPoints);
    mockGetLapDistPct.mockReturnValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockReturnValue(lapTime);

    updateReferenceLaps();

    const newLap = getActiveLap(0);
    expect(newLap?.startTime).toBe(lapTime);
    expect(newLap?.refPoints.size).toBe(1);
  });

  it('saves a clean fast lap as best lap', () => {
    const lapTime = 80;
    seedActiveLap(0, MIN_VALID_POINTS);
    mockGetLapDistPct.mockReturnValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockReturnValue(lapTime);

    updateReferenceLaps();

    expect(getBestLap(0)).not.toBeNull();
    expect(mockPrecomputePCHIPTangents).toHaveBeenCalledOnce();
  });

  it('does not save best lap when point count < 400', () => {
    const lapTime = 80;
    seedActiveLap(0, MIN_VALID_POINTS - 1);
    mockGetLapDistPct.mockReturnValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockReturnValue(lapTime);

    updateReferenceLaps();

    expect(getBestLap(0)).toBeNull();
    expect(mockPrecomputePCHIPTangents).not.toHaveBeenCalled();
  });

  it('does not save best lap when lap is dirty', () => {
    const lapTime = 80;
    seedActiveLap(0, MIN_VALID_POINTS, { isCleanLap: false });
    mockGetLapDistPct.mockReturnValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockReturnValue(lapTime);

    updateReferenceLaps();

    expect(getBestLap(0)).toBeNull();
  });

  it('replaces best lap when new lap is faster', () => {
    const existingBestLapTime = 90;
    const newLapTime = 80;
    const existingBest: ReferenceLap = {
      startTime: 0,
      finishTime: existingBestLapTime,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    };
    setBestLap(0, existingBest);

    seedActiveLap(0, MIN_VALID_POINTS);
    mockGetLapDistPct.mockReturnValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockReturnValue(newLapTime);

    updateReferenceLaps();

    const best = getBestLap(0);
    expect(best?.finishTime).toBe(newLapTime);
    expect(best?.startTime).toBe(0);
  });

  it('keeps existing best lap when new lap is slower', () => {
    const existingBestLapTime = 80;
    const newLapTime = 90;
    const existingBest: ReferenceLap = {
      startTime: 0,
      finishTime: existingBestLapTime,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    };
    setBestLap(0, existingBest);

    seedActiveLap(0, MIN_VALID_POINTS);
    mockGetLapDistPct.mockReturnValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockReturnValue(newLapTime);

    updateReferenceLaps();

    expect(getBestLap(0)).toBe(existingBest);
  });

  it('does not replace best lap when new lap is equal (not strictly faster)', () => {
    const lapTime = 80;
    const existingBest: ReferenceLap = {
      startTime: 0,
      finishTime: lapTime,
      refPoints: new Map(),
      lastTrackedPct: 0.99,
      isCleanLap: true,
    };
    setBestLap(0, existingBest);

    seedActiveLap(0, MIN_VALID_POINTS);
    mockGetLapDistPct.mockReturnValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockReturnValue(lapTime);

    updateReferenceLaps();

    expect(getBestLap(0)).toBe(existingBest);
  });
});
