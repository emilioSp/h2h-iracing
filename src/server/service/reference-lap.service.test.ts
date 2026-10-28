// Verifies reference lap tracking and interpolation during regression tests.
import { beforeEach, describe, expect, it } from 'vitest';

import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import referenceLapRepository, {
  type ReferencePoint,
} from '#repository/reference-lap.repository.ts';
import { interpolateTimeAtTrackPosition } from '#server/utils/interpolate-time-at-track-position.ts';
import { normalizeTrackPct } from '#server/utils/normalize-track-pct.ts';
import referenceLapService from '#service/reference-lap.service.ts';

beforeEach(() => {
  referenceLapRepository.resetReferenceLaps();
});

describe('updateReferenceLaps', () => {
  it('given iRacing reports a negative lap position when reference laps are updated then no active lap is created', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/reference-lap/negative.json',
    );
    await driverRepository.refreshDriverInfo();
    referenceLapService.initReferenceInterval(await irsdkRepository.getTrackLengthMeters());
    await referenceLapService.updateReferenceLaps();
    expect(referenceLapRepository.getActiveRefLap(0)).toBeNull();
  });
  it('given iRacing reports the first point of a lap when reference laps are updated then a new active lap is created', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/reference-lap/session-start.json',
    );
    await driverRepository.refreshDriverInfo();
    referenceLapService.initReferenceInterval(await irsdkRepository.getTrackLengthMeters());
    await referenceLapService.updateReferenceLaps();
    expect(referenceLapRepository.getActiveRefLap(0)).toEqual({
      startTime: 50,
      finishTime: -1,
      refPoints: new Map([
        [
          normalizeTrackPct({
            trackPct: 0.5,
            referenceInterval: referenceLapService.getReferenceInterval(),
          }),
          {
            trackPct: 0.5,
            timeElapsedSinceStart: 0,
          },
        ],
      ]),
      lastTrackedPct: 0.5,
      isOnPitRoad: false,
    });
  });
  it('given iRacing reports two points in different buckets when reference laps are updated then both points are stored', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/reference-lap/two-points.json',
    );
    await driverRepository.refreshDriverInfo();
    referenceLapService.initReferenceInterval(await irsdkRepository.getTrackLengthMeters());
    await irsdkRepository.refreshTelemetry();
    await referenceLapService.updateReferenceLaps();
    await irsdkRepository.refreshTelemetry();
    await referenceLapService.updateReferenceLaps();
    expect(referenceLapRepository.getActiveRefLap(0)?.refPoints.size).toBe(2);
  });
  it('given iRacing repeats a point in the same bucket when reference laps are updated then no duplicate point is stored', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/reference-lap/two-points.json',
    );
    await driverRepository.refreshDriverInfo();
    referenceLapService.initReferenceInterval(await irsdkRepository.getTrackLengthMeters());
    await irsdkRepository.refreshTelemetry();
    await referenceLapService.updateReferenceLaps();
    await referenceLapService.updateReferenceLaps();
    expect(referenceLapRepository.getActiveRefLap(0)?.refPoints.size).toBe(1);
  });
  it('given iRacing reports that a car entered pit road when reference laps are updated then its active lap is dirty', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/reference-lap/pit-road.json',
    );
    await driverRepository.refreshDriverInfo();
    referenceLapService.initReferenceInterval(await irsdkRepository.getTrackLengthMeters());
    const refPoints = new Map<number, ReferencePoint>();

    for (let point = 0; point < 5; point++) {
      const trackPct = point * referenceLapService.getReferenceInterval();
      refPoints.set(trackPct, {
        trackPct,
        timeElapsedSinceStart: point,
      });
    }

    referenceLapRepository.setActiveRefLap({
      carIdx: 0,
      lap: {
        startTime: 0,
        finishTime: -1,
        refPoints,
        lastTrackedPct: 0.5,
        isOnPitRoad: false,
      },
    });
    await referenceLapService.updateReferenceLaps();
    expect(referenceLapRepository.getActiveRefLap(0)?.isOnPitRoad).toBe(true);
  });
  it('given iRacing reports a finish-line crossing when reference laps are updated then a new active lap starts', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/reference-lap/finish.json');
    await driverRepository.refreshDriverInfo();
    referenceLapService.initReferenceInterval(await irsdkRepository.getTrackLengthMeters());
    const refPoints = new Map<number, ReferencePoint>();

    for (let point = 0; point < 5; point++) {
      const trackPct = point * referenceLapService.getReferenceInterval();
      refPoints.set(trackPct, {
        trackPct,
        timeElapsedSinceStart: point,
      });
    }

    referenceLapRepository.setActiveRefLap({
      carIdx: 0,
      lap: {
        startTime: 0,
        finishTime: -1,
        refPoints,
        lastTrackedPct: 0.97,
        isOnPitRoad: false,
      },
    });
    await referenceLapService.updateReferenceLaps();
    expect(referenceLapRepository.getActiveRefLap(0)).toEqual({
      startTime: 80,
      finishTime: -1,
      refPoints: new Map([
        [
          0.01,
          {
            trackPct: 0.01,
            timeElapsedSinceStart: 0,
          },
        ],
      ]),
      lastTrackedPct: 0.01,
      isOnPitRoad: false,
    });
  });
  it('given iRacing reports a complete clean lap when reference laps are updated then the lap enters the recent window', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/reference-lap/finish.json');
    await driverRepository.refreshDriverInfo();
    referenceLapService.initReferenceInterval(await irsdkRepository.getTrackLengthMeters());
    const refPoints = new Map<number, ReferencePoint>();

    for (let point = 0; point < referenceLapService.getMinPointsForValidLap(); point++) {
      const trackPct = point * referenceLapService.getReferenceInterval();
      refPoints.set(trackPct, {
        trackPct,
        timeElapsedSinceStart: point,
      });
    }

    referenceLapRepository.setActiveRefLap({
      carIdx: 0,
      lap: {
        startTime: 0,
        finishTime: -1,
        refPoints,
        lastTrackedPct: 0.97,
        isOnPitRoad: false,
      },
    });
    await referenceLapService.updateReferenceLaps();
    expect(referenceLapRepository.getRefLap(0)).not.toBeNull();
  });
  it('given iRacing reports a lap below the point threshold when reference laps are updated then the lap is excluded from the recent window', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/reference-lap/finish.json');
    await driverRepository.refreshDriverInfo();
    referenceLapService.initReferenceInterval(await irsdkRepository.getTrackLengthMeters());
    const refPoints = new Map<number, ReferencePoint>();

    for (let point = 0; point < referenceLapService.getMinPointsForValidLap() - 1; point++) {
      const trackPct = point * referenceLapService.getReferenceInterval();
      refPoints.set(trackPct, {
        trackPct,
        timeElapsedSinceStart: point,
      });
    }

    referenceLapRepository.setActiveRefLap({
      carIdx: 0,
      lap: {
        startTime: 0,
        finishTime: -1,
        refPoints,
        lastTrackedPct: 0.97,
        isOnPitRoad: false,
      },
    });
    await referenceLapService.updateReferenceLaps();
    expect(referenceLapRepository.getRefLap(0)).toBeNull();
  });
  it('given iRacing reports a dirty lap when reference laps are updated then the lap is excluded from the recent window', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/reference-lap/finish.json');
    await driverRepository.refreshDriverInfo();
    referenceLapService.initReferenceInterval(await irsdkRepository.getTrackLengthMeters());
    const refPoints = new Map<number, ReferencePoint>();

    for (let point = 0; point < referenceLapService.getMinPointsForValidLap(); point++) {
      const trackPct = point * referenceLapService.getReferenceInterval();
      refPoints.set(trackPct, {
        trackPct,
        timeElapsedSinceStart: point,
      });
    }

    referenceLapRepository.setActiveRefLap({
      carIdx: 0,
      lap: {
        startTime: 0,
        finishTime: -1,
        refPoints,
        lastTrackedPct: 0.97,
        isOnPitRoad: true,
      },
    });
    await referenceLapService.updateReferenceLaps();
    expect(referenceLapRepository.getRefLap(0)).toBeNull();
  });
});

describe('normalizeTrackPct', () => {
  it('given the track position is at the start line when the position is normalized then zero is returned', () => {
    expect(
      normalizeTrackPct({
        trackPct: 0,
        referenceInterval: 10 / 5_000,
      }),
    ).toBe(0);
  });
  it('given the track position is on a bucket boundary when the position is normalized then the position is unchanged', () => {
    expect(
      normalizeTrackPct({
        trackPct: 10 / 5_000,
        referenceInterval: 10 / 5_000,
      }),
    ).toBe(10 / 5_000);
  });
  it('given the track position is between bucket boundaries when the position is normalized then it is truncated to the lower boundary', () => {
    const interval = 10 / 5_000;
    const positionBetweenBoundaries = interval * 1.5;
    expect(
      normalizeTrackPct({
        trackPct: positionBetweenBoundaries,
        referenceInterval: 10 / 5_000,
      }),
    ).toBe(interval);
  });
  it('given the track position is negative when the position is normalized then it is clamped to zero', () => {
    expect(
      normalizeTrackPct({
        trackPct: -0.1,
        referenceInterval: 10 / 5_000,
      }),
    ).toBe(0);
  });
});

describe('interpolateTimeAtTrackPosition', () => {
  it('given the target bucket has no reference point when the time is interpolated then null is returned', () => {
    const lap = {
      refPoints: new Map([
        [
          0.5,
          {
            trackPct: 0.5,
            timeElapsedSinceStart: 50,
          },
        ],
      ]),
      startTime: 0,
      finishTime: 100,
      lastTrackedPct: 0,
      isOnPitRoad: false,
    };

    expect(
      interpolateTimeAtTrackPosition({
        referenceInterval: 10 / 5_000,
        lap,
        currentTrackPositionPct: 0.3,
      }),
    ).toBeNull();
  });
  it('given the next reference point is missing when the time is interpolated then the known time is returned', () => {
    const trackPct = 0.5;

    const key = normalizeTrackPct({
      trackPct: trackPct,
      referenceInterval: 10 / 5_000,
    });

    const lap = {
      refPoints: new Map([
        [
          key,
          {
            trackPct: key,
            timeElapsedSinceStart: 50,
          },
        ],
      ]),
      startTime: 0,
      finishTime: 100,
      lastTrackedPct: 0,
      isOnPitRoad: false,
    };

    expect(
      interpolateTimeAtTrackPosition({
        referenceInterval: 10 / 5_000,
        lap,
        currentTrackPositionPct: trackPct,
      }),
    ).toBe(50);
  });
  it('given two reference points surround the track position when the time is interpolated then the time is linearly interpolated', () => {
    const interval = 10 / 5_000;

    const lap = {
      refPoints: new Map([
        [
          0,
          {
            trackPct: 0,
            timeElapsedSinceStart: 0,
          },
        ],
        [
          interval,
          {
            trackPct: interval,
            timeElapsedSinceStart: 10,
          },
        ],
      ]),
      startTime: 0,
      finishTime: 100,
      lastTrackedPct: 0,
      isOnPitRoad: false,
    };

    expect(
      interpolateTimeAtTrackPosition({
        referenceInterval: 10 / 5_000,
        lap,
        currentTrackPositionPct: interval / 2,
      }),
    ).toBeCloseTo(5, 10);
  });
  it('given reference points cross the finish line when the time is interpolated then the completed lap time is used for interpolation', () => {
    const interval = 10 / 5_000;
    const lapTime = 100;
    const lastPct = 1 - interval;

    const lap = {
      refPoints: new Map([
        [
          lastPct,
          {
            trackPct: lastPct,
            timeElapsedSinceStart: lastPct * lapTime,
          },
        ],
        [
          0,
          {
            trackPct: 0,
            timeElapsedSinceStart: 0,
          },
        ],
      ]),
      startTime: 0,
      finishTime: lapTime,
      lastTrackedPct: 0,
      isOnPitRoad: false,
    };

    const currentTrackPositionPct = lastPct + interval / 2;
    const expected = lastPct * lapTime + (interval / 2) * lapTime;
    expect(
      interpolateTimeAtTrackPosition({
        referenceInterval: 10 / 5_000,
        lap,
        currentTrackPositionPct,
      }),
    ).toBeCloseTo(expected, 3);
  });
});
