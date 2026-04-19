import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('#repository/irsdk.repository.ts', () => ({
  getLapDistPct: vi.fn(),
  getSessionTime: vi.fn(),
  getOnPitRoad: vi.fn(),
}));

vi.mock('#repository/driver.repository.ts', () => ({
  getPlayerClassCarIdx: vi.fn(),
}));

import {
  getLapDistPct,
  getOnPitRoad,
  getSessionTime,
} from '#repository/irsdk.repository.ts';
import * as referenceLapRepository from '#repository/reference-lap.repository.ts';
import {
  getActiveRefLap,
  type ReferenceLap,
  type ReferencePoint,
  resetReferenceLaps,
  setActiveRefLap,
} from '#repository/reference-lap.repository.ts';
import * as referenceLapService from '#service/reference-lap.service.ts';

vi.spyOn(referenceLapRepository, 'addRecentLap');
vi.spyOn(referenceLapRepository, 'setActiveRefLap');
vi.spyOn(referenceLapService, 'normalizeTrackPct');

import { getPlayerClassCarIdx } from '#repository/driver.repository.ts';
import {
  getMinPointsForValidLap,
  getReferenceInterval,
  initReferenceInterval,
  interpolateTimeAtTrackPosition,
  normalizeTrackPct,
  updateReferenceLaps,
} from '#service/reference-lap.service.ts';

const TEST_TRACK_LENGTH_METERS = 5000;

const mockGetLapDistPct = vi.mocked(getLapDistPct);
const mockGetSessionTime = vi.mocked(getSessionTime);
const mockGetOnPitRoad = vi.mocked(getOnPitRoad);
const mockGetCarIdxs = vi.mocked(getPlayerClassCarIdx);

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
    isOnPitRoad: false,
    ...opts,
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  resetReferenceLaps();
  initReferenceInterval(TEST_TRACK_LENGTH_METERS);
  mockGetLapDistPct.mockResolvedValue([DEFAULT_TRACK_PCT]);
  mockGetSessionTime.mockResolvedValue(DEFAULT_SESSION_TIME);
  mockGetOnPitRoad.mockResolvedValue([0]);
  mockGetCarIdxs.mockResolvedValue([0]);
});

describe('updateReferenceLaps', () => {
  it('skips cars with lapDistPct < 0', async () => {
    mockGetLapDistPct.mockResolvedValue([-1]);

    await updateReferenceLaps();

    expect(referenceLapService.normalizeTrackPct).not.toHaveBeenCalled();
  });

  it('initialises a new active lap on first data point', async () => {
    const sessionStart = 50;
    mockGetLapDistPct.mockResolvedValue([DEFAULT_TRACK_PCT]);
    mockGetSessionTime.mockResolvedValue(sessionStart);

    await updateReferenceLaps();
    expect(referenceLapRepository.setActiveRefLap).toHaveBeenCalledOnce();

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
      isOnPitRoad: false,
    });
    mockGetLapDistPct.mockResolvedValue([nextPct]);
    mockGetOnPitRoad.mockResolvedValue([1]);

    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.isOnPitRoad).toBe(true);
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

    expect(referenceLapRepository.addRecentLap).toHaveBeenCalled();
  });

  it('does not add to recent window when point count is below threshold', async () => {
    const lapTime = 80;
    seedActiveLap(0, getMinPointsForValidLap() - 1);
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(lapTime);

    await updateReferenceLaps();

    expect(referenceLapRepository.addRecentLap).not.toHaveBeenCalled();
  });

  it('does not add to recent window when lap is dirty', async () => {
    const lapTime = 80;
    seedActiveLap(0, getMinPointsForValidLap(), { isOnPitRoad: true });
    mockGetLapDistPct.mockResolvedValue([PAST_FINISH_LINE_PCT]);
    mockGetSessionTime.mockResolvedValue(lapTime);

    await updateReferenceLaps();

    expect(referenceLapRepository.addRecentLap).not.toHaveBeenCalled();
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
    const interval = getReferenceInterval();
    const keyBetweenBoundaries = interval * 1.5;
    expect(normalizeTrackPct(keyBetweenBoundaries)).toBe(interval);
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
    isOnPitRoad: false,
  });

  it('returns null when no refPoint exists at the target position', () => {
    const lap = makeLap([[0.5, makePoint(0.5, 50)]]);
    expect(interpolateTimeAtTrackPosition(lap, 0.3)).toBeNull();
  });

  it('returns the p0 time when no next point exists', () => {
    const rawPct = 0.5;
    const key = normalizeTrackPct(rawPct);
    const time = 50;
    const lap = makeLap([[key, makePoint(key, time)]]);
    expect(interpolateTimeAtTrackPosition(lap, rawPct)).toBe(time);
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
