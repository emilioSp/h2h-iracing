import { beforeEach, describe, expect, it, vi } from 'vitest';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import {
  addRecentLap,
  type ReferenceLap,
  resetReferenceLaps,
} from '#repository/reference-lap.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import * as GapDelta from '#server/utils/gap-delta.ts';
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

const loadGapFixture = async (name: string): Promise<void> => {
  loadTelemetryFixture(`fixture/telemetry-mock/gap/${name}.json`);
  await refreshDriverInfo();
};

beforeEach(() => {
  vi.restoreAllMocks();
  initReferenceInterval(5_000);
  resetReferenceLaps();
});

describe('getGap', () => {
  it('returns 0 seconds when both cars are the same', async () => {
    const result = await getGap({
      ahead: makeCar(0),
      player: makeCar(0),
      behind: null,
    });

    expect(result.gapAhead).toEqual({ value: 0, unit: 'seconds' });
    expect(result.gapBehind).toBeNull();
  });

  it('uses the estimated delta when a car is on pit road', async () => {
    await loadGapFixture('pit-road');
    const estimatedDelta = vi.spyOn(GapDelta, 'estimatedDelta');
    const referenceDelta = vi.spyOn(GapDelta, 'referenceDelta');

    const result = await getGap({
      ahead: makeCar(1),
      player: makeCar(0),
      behind: null,
    });

    expect(estimatedDelta).toHaveBeenCalled();
    expect(referenceDelta).not.toHaveBeenCalled();
    expect(result.gapAhead).toEqual({ value: 18, unit: 'seconds' });
    expect(result.gapBehind).toBeNull();
  });

  it('uses reference laps when all cars are on track', async () => {
    await loadGapFixture('reference');
    for (const carIdx of [0, 1, 2]) {
      addRecentLap({ carIdx, lap: makeReferenceLap() });
    }
    const referenceDelta = vi.spyOn(GapDelta, 'referenceDelta');
    const estimatedDelta = vi.spyOn(GapDelta, 'estimatedDelta');

    const result = await getGap({
      ahead: makeCar(1),
      player: makeCar(0),
      behind: makeCar(2),
    });

    expect(referenceDelta).toHaveBeenCalled();
    expect(estimatedDelta).not.toHaveBeenCalled();
    expect(result.gapAhead).toEqual({ value: 18, unit: 'seconds' });
    expect(result.gapBehind).toEqual({ value: 18, unit: 'seconds' });
  });

  it('corrects the gap after the ahead car crosses the finish line', async () => {
    await loadGapFixture('crossed-finish');
    addRecentLap({ carIdx: 0, lap: makeReferenceLap() });

    const result = await getGap({
      ahead: makeCar(1),
      player: makeCar(0),
      behind: null,
    });

    expect(result.gapAhead?.unit).toBe('seconds');
    expect(result.gapAhead?.value).toBeCloseTo(54);
  });

  it('uses the estimated delta when the behind car has fewer than 2 laps', async () => {
    await loadGapFixture('few-laps');
    addRecentLap({ carIdx: 0, lap: makeReferenceLap() });
    const estimatedDelta = vi.spyOn(GapDelta, 'estimatedDelta');
    const referenceDelta = vi.spyOn(GapDelta, 'referenceDelta');

    const result = await getGap({
      ahead: makeCar(1),
      player: makeCar(0),
      behind: null,
    });

    expect(estimatedDelta).toHaveBeenCalled();
    expect(referenceDelta).not.toHaveBeenCalled();
    expect(result.gapAhead).toEqual({ value: 18, unit: 'seconds' });
  });

  it('handles finish-line wrap with an estimated delta', async () => {
    await loadGapFixture('estimated-wrap');
    const estimatedDelta = vi.spyOn(GapDelta, 'estimatedDelta');
    const referenceDelta = vi.spyOn(GapDelta, 'referenceDelta');

    const result = await getGap({
      ahead: makeCar(0),
      player: makeCar(1),
      behind: null,
    });

    expect(estimatedDelta).toHaveBeenCalled();
    expect(referenceDelta).not.toHaveBeenCalled();
    expect(result.gapAhead?.unit).toBe('seconds');
    expect(result.gapAhead?.value).toBeCloseTo(3.6);
  });

  it('handles finish-line wrap with a reference lap', async () => {
    await loadGapFixture('reference-wrap');
    addRecentLap({ carIdx: 0, lap: makeReferenceLap() });
    addRecentLap({ carIdx: 1, lap: makeReferenceLap() });
    const referenceDelta = vi.spyOn(GapDelta, 'referenceDelta');
    const estimatedDelta = vi.spyOn(GapDelta, 'estimatedDelta');

    const result = await getGap({
      ahead: null,
      player: makeCar(0),
      behind: makeCar(1),
    });

    expect(referenceDelta).toHaveBeenCalled();
    expect(estimatedDelta).not.toHaveBeenCalled();
    expect(result.gapBehind?.unit).toBe('seconds');
    expect(result.gapBehind?.value).toBeCloseTo(3.6);
  });

  it('returns laps when cars are multiple laps apart', async () => {
    await loadGapFixture('multiple-laps');

    const result = await getGap({
      ahead: makeCar(1),
      player: makeCar(0),
      behind: makeCar(2),
    });

    expect(result.gapAhead).toEqual({ value: 2, unit: 'laps' });
    expect(result.gapBehind).toEqual({ value: 2, unit: 'laps' });
  });
});
