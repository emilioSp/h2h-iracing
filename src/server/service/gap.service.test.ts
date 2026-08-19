import { beforeEach, describe, expect, it, vi } from 'vitest';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import {
  addRecentLap,
  type ReferenceLap,
  resetReferenceLaps,
} from '#repository/reference-lap.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import * as gapDelta from '#server/utils/gap-delta.ts';
import { getGap } from '#service/gap.service.ts';
import {
  getReferenceInterval,
  initReferenceInterval,
  normalizeTrackPct,
} from '#service/reference-lap.service.ts';

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
  const lapTime = 90;
  const interval = getReferenceInterval();
  const percentages = [
    0.02,
    0.02 + interval,
    0.1,
    0.1 + interval,
    0.3,
    0.3 + interval,
    0.5,
    0.5 + interval,
    0.98,
    0.98 + interval,
  ];

  return {
    startTime: 0,
    finishTime: lapTime,
    refPoints: new Map(
      percentages.map((trackPct) => [
        normalizeTrackPct(trackPct),
        { trackPct, timeElapsedSinceStart: trackPct * lapTime },
      ]),
    ),
    lastTrackedPct: 0.99,
    isOnPitRoad: false,
  };
};

beforeEach(() => {
  vi.restoreAllMocks();
  initReferenceInterval(5_000);
  resetReferenceLaps();
});

describe('getGap', () => {
  it('When the same car is passed as player and ahead then the ahead gap is zero and the behind gap is empty', async () => {
    const result = await getGap({
      ahead: makeCar(0),
      player: makeCar(0),
      behind: null,
    });

    expect(result).toEqual({
      gapAhead: { value: 0, unit: 'seconds' },
      gapBehind: null,
    });
  });

  it('When iRacing reports a car on pit road then only the estimated delta is used', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/gap/pit-road.json');
    await refreshDriverInfo();
    const estimatedDelta = vi.spyOn(gapDelta, 'estimatedDelta');
    const referenceDelta = vi.spyOn(gapDelta, 'referenceDelta');

    await getGap({
      ahead: makeCar(1),
      player: makeCar(0),
      behind: null,
    });

    expect(estimatedDelta).toHaveBeenCalled();
    expect(referenceDelta).not.toHaveBeenCalled();
  });

  it('When iRacing reports all cars on track with reference laps then only reference deltas are used', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/gap/reference.json');
    await refreshDriverInfo();
    for (const carIdx of [0, 1, 2]) {
      addRecentLap({ carIdx, lap: makeReferenceLap() });
    }
    const referenceDelta = vi.spyOn(gapDelta, 'referenceDelta');
    const estimatedDelta = vi.spyOn(gapDelta, 'estimatedDelta');

    await getGap({
      ahead: makeCar(1),
      player: makeCar(0),
      behind: makeCar(2),
    });

    expect(referenceDelta).toHaveBeenCalled();
    expect(estimatedDelta).not.toHaveBeenCalled();
  });

  it('When iRacing reports the ahead car across the finish line then the gap is corrected', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/gap/crossed-finish.json');
    await refreshDriverInfo();
    addRecentLap({ carIdx: 0, lap: makeReferenceLap() });

    const result = await getGap({
      ahead: makeCar(1),
      player: makeCar(0),
      behind: null,
    });

    expect(result.gapAhead).toEqual({
      value: expect.closeTo(54),
      unit: 'seconds',
    });
  });

  it('When iRacing reports fewer than two completed laps then only the estimated delta is used', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/gap/few-laps.json');
    await refreshDriverInfo();
    addRecentLap({ carIdx: 0, lap: makeReferenceLap() });
    const estimatedDelta = vi.spyOn(gapDelta, 'estimatedDelta');
    const referenceDelta = vi.spyOn(gapDelta, 'referenceDelta');

    await getGap({
      ahead: makeCar(1),
      player: makeCar(0),
      behind: null,
    });

    expect(estimatedDelta).toHaveBeenCalled();
    expect(referenceDelta).not.toHaveBeenCalled();
  });

  it('When iRacing reports an estimated gap across the finish line then the gap wraps', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/gap/estimated-wrap.json');
    await refreshDriverInfo();

    const result = await getGap({
      ahead: makeCar(0),
      player: makeCar(1),
      behind: null,
    });

    expect(result.gapAhead).toEqual({
      value: expect.closeTo(3.6),
      unit: 'seconds',
    });
  });

  it('When iRacing reports a reference gap across the finish line then the gap wraps', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/gap/reference-wrap.json');
    await refreshDriverInfo();
    addRecentLap({ carIdx: 0, lap: makeReferenceLap() });
    addRecentLap({ carIdx: 1, lap: makeReferenceLap() });

    const result = await getGap({
      ahead: null,
      player: makeCar(0),
      behind: makeCar(1),
    });

    expect(result.gapBehind).toEqual({
      value: expect.closeTo(3.6),
      unit: 'seconds',
    });
  });

  it('When iRacing reports cars multiple laps apart then both gaps use laps', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/gap/multiple-laps.json');
    await refreshDriverInfo();

    const result = await getGap({
      ahead: makeCar(1),
      player: makeCar(0),
      behind: makeCar(2),
    });

    expect(result).toEqual({
      gapAhead: { value: 2, unit: 'laps' },
      gapBehind: { value: 2, unit: 'laps' },
    });
  });
});
