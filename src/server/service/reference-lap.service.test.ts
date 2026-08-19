import { beforeEach, describe, expect, it } from 'vitest';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import {
  getTrackLengthMeters,
  loadTelemetryFixture,
  refreshTelemetry,
} from '#repository/irsdk.repository.ts';
import {
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
  initReferenceInterval,
  interpolateTimeAtTrackPosition,
  normalizeTrackPct,
  updateReferenceLaps,
} from '#service/reference-lap.service.ts';

const seedActiveLap = ({
  carIdx,
  pointCount,
  overrides,
}: {
  carIdx: number;
  pointCount: number;
  overrides?: Partial<ReferenceLap>;
}): void => {
  const interval = getReferenceInterval();
  const refPoints = new Map<number, ReferencePoint>();
  for (let point = 0; point < pointCount; point++) {
    const trackPct = point * interval;
    refPoints.set(trackPct, {
      trackPct,
      timeElapsedSinceStart: point,
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
      ...overrides,
    },
  });
};

beforeEach(() => {
  resetReferenceLaps();
});

describe('updateReferenceLaps', () => {
  it('When iRacing reports a negative lap position then no active lap is created', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/reference-lap/negative.json');
    await refreshDriverInfo();
    initReferenceInterval(await getTrackLengthMeters());

    await updateReferenceLaps();

    expect(getActiveRefLap(0)).toBeNull();
  });

  it('When iRacing reports the first point of a lap then a new active lap is created', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/reference-lap/session-start.json',
    );
    await refreshDriverInfo();
    initReferenceInterval(await getTrackLengthMeters());

    await updateReferenceLaps();

    expect(getActiveRefLap(0)).toEqual({
      startTime: 50,
      finishTime: -1,
      refPoints: new Map([
        [normalizeTrackPct(0.5), { trackPct: 0.5, timeElapsedSinceStart: 0 }],
      ]),
      lastTrackedPct: 0.5,
      isOnPitRoad: false,
    });
  });

  it('When iRacing reports two points in different buckets then both points are stored', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/reference-lap/two-points.json',
    );
    await refreshDriverInfo();
    initReferenceInterval(await getTrackLengthMeters());
    await refreshTelemetry();
    await updateReferenceLaps();

    await refreshTelemetry();
    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.refPoints.size).toBe(2);
  });

  it('When iRacing repeats a point in the same bucket then no duplicate point is stored', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/reference-lap/two-points.json',
    );
    await refreshDriverInfo();
    initReferenceInterval(await getTrackLengthMeters());
    await refreshTelemetry();
    await updateReferenceLaps();

    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.refPoints.size).toBe(1);
  });

  it('When iRacing reports that a car entered pit road then its active lap is dirty', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/reference-lap/pit-road.json');
    await refreshDriverInfo();
    initReferenceInterval(await getTrackLengthMeters());
    seedActiveLap({
      carIdx: 0,
      pointCount: 5,
      overrides: { lastTrackedPct: 0.5, isOnPitRoad: false },
    });

    await updateReferenceLaps();

    expect(getActiveRefLap(0)?.isOnPitRoad).toBe(true);
  });

  it('When iRacing reports a finish-line crossing then a new active lap starts', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/reference-lap/finish.json');
    await refreshDriverInfo();
    initReferenceInterval(await getTrackLengthMeters());
    seedActiveLap({ carIdx: 0, pointCount: 5 });

    await updateReferenceLaps();

    expect(getActiveRefLap(0)).toEqual({
      startTime: 80,
      finishTime: -1,
      refPoints: new Map([
        [0.01, { trackPct: 0.01, timeElapsedSinceStart: 0 }],
      ]),
      lastTrackedPct: 0.01,
      isOnPitRoad: false,
    });
  });

  it('When iRacing reports a complete clean lap then the lap enters the recent window', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/reference-lap/finish.json');
    await refreshDriverInfo();
    initReferenceInterval(await getTrackLengthMeters());
    seedActiveLap({ carIdx: 0, pointCount: getMinPointsForValidLap() });

    await updateReferenceLaps();

    expect(getRefLap(0)).not.toBeNull();
  });

  it('When iRacing reports a lap below the point threshold then the lap is excluded from the recent window', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/reference-lap/finish.json');
    await refreshDriverInfo();
    initReferenceInterval(await getTrackLengthMeters());
    seedActiveLap({
      carIdx: 0,
      pointCount: getMinPointsForValidLap() - 1,
    });

    await updateReferenceLaps();

    expect(getRefLap(0)).toBeNull();
  });

  it('When iRacing reports a dirty lap then the lap is excluded from the recent window', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/reference-lap/finish.json');
    await refreshDriverInfo();
    initReferenceInterval(await getTrackLengthMeters());
    seedActiveLap({
      carIdx: 0,
      pointCount: getMinPointsForValidLap(),
      overrides: { isOnPitRoad: true },
    });

    await updateReferenceLaps();

    expect(getRefLap(0)).toBeNull();
  });
});

describe('normalizeTrackPct', () => {
  beforeEach(() => {
    initReferenceInterval(5_000);
  });

  it('When the track position is at the start line then zero is returned', () => {
    expect(normalizeTrackPct(0)).toBe(0);
  });

  it('When the track position is on a bucket boundary then the position is unchanged', () => {
    expect(normalizeTrackPct(getReferenceInterval())).toBe(
      getReferenceInterval(),
    );
  });

  it('When the track position is between bucket boundaries then it is truncated to the lower boundary', () => {
    const interval = getReferenceInterval();
    const positionBetweenBoundaries = interval * 1.5;

    expect(normalizeTrackPct(positionBetweenBoundaries)).toBe(interval);
  });

  it('When the track position is negative then it is clamped to zero', () => {
    expect(normalizeTrackPct(-0.1)).toBe(0);
  });
});

describe('interpolateTimeAtTrackPosition', () => {
  const makePoint = (trackPct: number, time: number): ReferencePoint => ({
    trackPct,
    timeElapsedSinceStart: time,
  });

  const makeLap = ({
    points,
    startTime = 0,
    finishTime = 100,
  }: {
    points: Array<[number, ReferencePoint]>;
    startTime?: number;
    finishTime?: number;
  }): ReferenceLap => ({
    refPoints: new Map(points),
    startTime,
    finishTime,
    lastTrackedPct: points[points.length - 1]?.[0] ?? 0,
    isOnPitRoad: false,
  });

  beforeEach(() => {
    initReferenceInterval(5_000);
  });

  it('When the target bucket has no reference point then null is returned', () => {
    const lap = makeLap({ points: [[0.5, makePoint(0.5, 50)]] });

    expect(
      interpolateTimeAtTrackPosition({
        lap,
        currentTrackPositionPct: 0.3,
      }),
    ).toBeNull();
  });

  it('When the next reference point is missing then the known time is returned', () => {
    const trackPct = 0.5;
    const key = normalizeTrackPct(trackPct);
    const lap = makeLap({ points: [[key, makePoint(key, 50)]] });

    expect(
      interpolateTimeAtTrackPosition({
        lap,
        currentTrackPositionPct: trackPct,
      }),
    ).toBe(50);
  });

  it('When two reference points surround the track position then the time is linearly interpolated', () => {
    const interval = getReferenceInterval();
    const lap = makeLap({
      points: [
        [0, makePoint(0, 0)],
        [interval, makePoint(interval, 10)],
      ],
    });

    expect(
      interpolateTimeAtTrackPosition({
        lap,
        currentTrackPositionPct: interval / 2,
      }),
    ).toBeCloseTo(5, 10);
  });

  it('When reference points cross the finish line then the completed lap time is used for interpolation', () => {
    const interval = getReferenceInterval();
    const lapTime = 100;
    const lastPct = 1 - interval;
    const lap = makeLap({
      points: [
        [lastPct, makePoint(lastPct, lastPct * lapTime)],
        [0, makePoint(0, 0)],
      ],
      finishTime: lapTime,
    });
    const currentTrackPositionPct = lastPct + interval / 2;
    const expected = lastPct * lapTime + (interval / 2) * lapTime;

    expect(
      interpolateTimeAtTrackPosition({ lap, currentTrackPositionPct }),
    ).toBeCloseTo(expected, 3);
  });
});
