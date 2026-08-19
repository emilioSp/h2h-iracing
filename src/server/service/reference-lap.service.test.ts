import { beforeEach, describe, expect, it, vi } from 'vitest';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import {
  getTrackLengthMeters,
  loadTelemetryFixture,
  refreshTelemetry,
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

import {
  getMinPointsForValidLap,
  getReferenceInterval,
  initReferenceInterval,
  interpolateTimeAtTrackPosition,
  normalizeTrackPct,
  updateReferenceLaps,
} from '#service/reference-lap.service.ts';

const loadReferenceLapFixture = async (name: string): Promise<void> => {
  loadTelemetryFixture(`fixture/telemetry-mock/reference-lap/${name}.json`);
  await refreshDriverInfo();
  initReferenceInterval(await getTrackLengthMeters());
};

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
  setActiveRefLap({
    carIdx,
    lap: {
      startTime: 0,
      finishTime: -1,
      refPoints,
      lastTrackedPct: 0.97,
      isOnPitRoad: false,
      ...opts,
    },
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  resetReferenceLaps();
});

describe('updateReferenceLaps', () => {
  it('skips cars with lapDistPct < 0', async () => {
    await loadReferenceLapFixture('negative');

    await updateReferenceLaps();

    expect(referenceLapService.normalizeTrackPct).not.toHaveBeenCalled();
  });

  it('initialises a new active lap on first data point', async () => {
    const sessionStart = 50;
    await loadReferenceLapFixture('session-start');

    await updateReferenceLaps();
    expect(referenceLapRepository.setActiveRefLap).toHaveBeenCalledOnce();

    const lap = getActiveRefLap(0);
    expect(lap).not.toBeNull();
    expect(lap?.startTime).toBe(sessionStart);
    expect(lap?.refPoints.size).toBe(1);
  });

  it('adds a refPoint to an existing active lap', async () => {
    await loadReferenceLapFixture('two-points');
    await refreshTelemetry();
    await updateReferenceLaps();

    await refreshTelemetry();
    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.refPoints.size).toBe(2);
  });

  it('does not add a duplicate refPoint for the same normalised key', async () => {
    await loadReferenceLapFixture('two-points');
    await refreshTelemetry();
    await updateReferenceLaps();
    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.refPoints.size).toBe(1);
  });

  it('marks a clean lap dirty when the car enters pit road', async () => {
    const currentPct = 0.5;
    const fewPoints = 5;
    await loadReferenceLapFixture('pit-road');
    seedActiveLap(0, fewPoints, {
      lastTrackedPct: currentPct,
      isOnPitRoad: false,
    });

    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.isOnPitRoad).toBe(true);
  });
});

describe('lap completion', async () => {
  it('resets active lap when lap wraps (lastTrackedPct > 0.95 → trackPct < 0.05)', async () => {
    const fewPoints = 5;
    const lapTime = 80;
    await loadReferenceLapFixture('finish');
    seedActiveLap(0, fewPoints);

    await updateReferenceLaps();

    const newLap = getActiveRefLap(0);
    expect(newLap?.startTime).toBe(lapTime);
    expect(newLap?.refPoints.size).toBe(1);
  });

  it('saves a valid clean lap to the recent window', async () => {
    await loadReferenceLapFixture('finish');
    seedActiveLap(0, getMinPointsForValidLap());

    await updateReferenceLaps();

    expect(referenceLapRepository.addRecentLap).toHaveBeenCalled();
  });

  it('does not add to recent window when point count is below threshold', async () => {
    await loadReferenceLapFixture('finish');
    seedActiveLap(0, getMinPointsForValidLap() - 1);

    await updateReferenceLaps();

    expect(referenceLapRepository.addRecentLap).not.toHaveBeenCalled();
  });

  it('does not add to recent window when lap is dirty', async () => {
    await loadReferenceLapFixture('finish');
    seedActiveLap(0, getMinPointsForValidLap(), { isOnPitRoad: true });

    await updateReferenceLaps();

    expect(referenceLapRepository.addRecentLap).not.toHaveBeenCalled();
  });
});

describe('normalizeTrackPct', () => {
  it('returns 0 for key = 0', async () => {
    await loadReferenceLapFixture('default');

    expect(normalizeTrackPct(0)).toBe(0);
  });

  it('returns the key unchanged when it falls exactly on a boundary', async () => {
    await loadReferenceLapFixture('default');

    expect(normalizeTrackPct(getReferenceInterval())).toBe(
      getReferenceInterval(),
    );
  });

  it('truncates to the nearest referenceInterval boundary below', async () => {
    await loadReferenceLapFixture('default');

    const interval = getReferenceInterval();
    const keyBetweenBoundaries = interval * 1.5;
    expect(normalizeTrackPct(keyBetweenBoundaries)).toBe(interval);
  });

  it('returns 0 for negative input', async () => {
    await loadReferenceLapFixture('default');

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

  it('returns null when no refPoint exists at the target position', async () => {
    await loadReferenceLapFixture('default');

    const lap = makeLap([[0.5, makePoint(0.5, 50)]]);
    expect(
      interpolateTimeAtTrackPosition({ lap, currentTrackPositionPct: 0.3 }),
    ).toBeNull();
  });

  it('uses the time from the only known marker when the next marker is missing', async () => {
    await loadReferenceLapFixture('default');

    const rawPct = 0.5;
    const key = normalizeTrackPct(rawPct);
    const time = 50;
    const lap = makeLap([[key, makePoint(key, time)]]);
    expect(
      interpolateTimeAtTrackPosition({ lap, currentTrackPositionPct: rawPct }),
    ).toBe(time);
  });

  it('linearly interpolates between two points', async () => {
    await loadReferenceLapFixture('default');

    const interval = getReferenceInterval();
    const lap = makeLap([
      [0.0, makePoint(0.0, 0)],
      [interval, makePoint(interval, 10)],
    ]);
    expect(
      interpolateTimeAtTrackPosition({
        lap,
        currentTrackPositionPct: interval / 2,
      }),
    ).toBeCloseTo(5, 10);
  });

  it('returns the stored time at an exact key', async () => {
    await loadReferenceLapFixture('default');

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
    expect(
      interpolateTimeAtTrackPosition({
        lap,
        currentTrackPositionPct: storedPct,
      }),
    ).toBeCloseTo(storedPct * lapTime, 5);
  });

  it('wraps time correctly when interpolating across the finish line', async () => {
    await loadReferenceLapFixture('default');

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
      interpolateTimeAtTrackPosition({ lap, currentTrackPositionPct }),
    ).toBeCloseTo(expected, 3);
  });
});
