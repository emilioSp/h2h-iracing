import { beforeEach, describe, expect, it } from 'vitest';
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';
import {
  getReferenceInterval,
  initReferenceInterval,
} from '#service/reference-lap.service.ts';
import {
  FASTER_CLASS_MARGIN_SECONDS,
  findTrafficBehind,
  isFasterCar,
} from '#service/traffic.service.ts';

const PLAYER_EST_LAP_TIME = 103.1952;
const PLAYER_CAR_IDX = 0;

// 10 m reference points over 1280 m give an interval of 1/128, which has no
// floating point drift when normalizeTrackPct snaps a position to its bucket.
const TEST_TRACK_LENGTH_METERS = 1280;
const REFERENCE_LAP_SECONDS = 100;

const buildDriver = (driver: Partial<Driver> & { carIdx: number }): Driver => ({
  name: `Driver ${driver.carIdx}`,
  carNumber: String(driver.carIdx),
  car: 'Dallara P217 LMP2',
  iRating: 3000,
  license: 'A 3.51',
  classEstLapTime: 94.5768,
  ...driver,
});

// A lap at constant speed: the time at any position is its percentage of 100 s.
const buildReferenceLap = (): ReferenceLap => {
  const interval = getReferenceInterval();
  const refPoints = new Map();

  for (let step = 0; step * interval <= 1; step++) {
    const trackPct = step * interval;
    refPoints.set(trackPct, {
      trackPct,
      timeElapsedSinceStart: trackPct * REFERENCE_LAP_SECONDS,
    });
  }

  return {
    refPoints,
    startTime: 0,
    finishTime: REFERENCE_LAP_SECONDS,
    lastTrackedPct: 1,
    isOnPitRoad: false,
  };
};

beforeEach(() => {
  initReferenceInterval(TEST_TRACK_LENGTH_METERS);
});

type RunInput = {
  drivers: Driver[];
  lapDistPct: number[];
  lapsCompleted?: number[];
  onPitRoad?: number[];
  refLap?: ReferenceLap | null;
};

const run = ({
  drivers,
  lapDistPct,
  lapsCompleted = [],
  onPitRoad = [],
  refLap = null,
}: RunInput) =>
  findTrafficBehind({
    playerCarIdx: PLAYER_CAR_IDX,
    playerClassEstLapTime: PLAYER_EST_LAP_TIME,
    drivers,
    lapDistPct,
    lapsCompleted,
    onPitRoad,
    getRefLapFor: () => refLap,
  });

describe('isFasterCar', () => {
  it('accepts a car a full class quicker', () => {
    expect(
      isFasterCar({
        carClassEstLapTime: 94.5768,
        playerClassEstLapTime: PLAYER_EST_LAP_TIME,
      }),
    ).toBe(true);
  });

  it('rejects a same-class car that is only 0.6 s quicker', () => {
    expect(
      isFasterCar({
        carClassEstLapTime: 102.5469,
        playerClassEstLapTime: PLAYER_EST_LAP_TIME,
      }),
    ).toBe(false);
  });

  it('rejects the Porsche Cup, which is slower over a lap', () => {
    expect(
      isFasterCar({
        carClassEstLapTime: 106.3155,
        playerClassEstLapTime: PLAYER_EST_LAP_TIME,
      }),
    ).toBe(false);
  });

  it('rejects a car with no estimated lap time', () => {
    expect(
      isFasterCar({
        carClassEstLapTime: 0,
        playerClassEstLapTime: PLAYER_EST_LAP_TIME,
      }),
    ).toBe(false);
  });

  it('accepts a car exactly on the margin', () => {
    expect(
      isFasterCar({
        carClassEstLapTime: PLAYER_EST_LAP_TIME - FASTER_CLASS_MARGIN_SECONDS,
        playerClassEstLapTime: PLAYER_EST_LAP_TIME,
      }),
    ).toBe(true);
  });
});

describe('findTrafficBehind', () => {
  it('reports a faster car just behind', () => {
    const cars = run({
      drivers: [buildDriver({ carIdx: 1 })],
      lapDistPct: [0.2, 0.199],
    });

    expect(cars).toHaveLength(1);
    expect(cars[0].carIdx).toBe(1);
    expect(cars[0].className).toBe('LMP2');
    expect(cars[0].gapSeconds).toBeCloseTo(0.0946, 3);
  });

  it('ignores the player', () => {
    expect(
      run({
        drivers: [buildDriver({ carIdx: PLAYER_CAR_IDX })],
        lapDistPct: [0.2],
      }),
    ).toEqual([]);
  });

  it('ignores a car in the pits', () => {
    expect(
      run({
        drivers: [buildDriver({ carIdx: 1 })],
        lapDistPct: [0.2, 0.199],
        onPitRoad: [0, 1],
      }),
    ).toEqual([]);
  });

  it('ignores a car that is not on track', () => {
    expect(
      run({
        drivers: [buildDriver({ carIdx: 1 })],
        lapDistPct: [0.2, -1],
      }),
    ).toEqual([]);
  });

  it('ignores a car of the same class', () => {
    expect(
      run({
        drivers: [buildDriver({ carIdx: 1, classEstLapTime: 102.5469 })],
        lapDistPct: [0.2, 0.199],
      }),
    ).toEqual([]);
  });

  it('ignores a faster car that is in front', () => {
    expect(
      run({
        drivers: [buildDriver({ carIdx: 1 })],
        lapDistPct: [0.2, 0.21],
      }),
    ).toEqual([]);
  });

  it('sees a car behind across the start line', () => {
    const cars = run({
      drivers: [buildDriver({ carIdx: 1 })],
      lapDistPct: [0.005, 0.999],
    });

    expect(cars).toHaveLength(1);
  });

  it('treats a car in front across the start line as in front', () => {
    expect(
      run({
        drivers: [buildDriver({ carIdx: 1 })],
        lapDistPct: [0.999, 0.005],
      }),
    ).toEqual([]);
  });

  it('drops a car outside the window', () => {
    expect(
      run({
        drivers: [buildDriver({ carIdx: 1 })],
        lapDistPct: [0.2, 0.15],
      }),
    ).toEqual([]);
  });

  it('uses the reference lap when the car has enough laps', () => {
    const cars = run({
      drivers: [buildDriver({ carIdx: 1 })],
      lapDistPct: [0.2, 0.19],
      lapsCompleted: [4, 4],
      refLap: buildReferenceLap(),
    });

    // The reference lap runs at 100 s, so 1% of the lap is 1 s.
    expect(cars[0].gapSeconds).toBeCloseTo(1, 5);
  });

  it('falls back to the estimate when the car has too few laps', () => {
    const cars = run({
      drivers: [buildDriver({ carIdx: 1 })],
      lapDistPct: [0.2, 0.19],
      lapsCompleted: [1, 1],
      refLap: buildReferenceLap(),
    });

    // The class lap time is 94.5768 s, so 1% of the lap is 0.9458 s.
    expect(cars[0].gapSeconds).toBeCloseTo(0.9458, 3);
  });

  it('sorts the nearest car first', () => {
    const cars = run({
      drivers: [
        buildDriver({ carIdx: 1 }),
        buildDriver({ carIdx: 2 }),
        buildDriver({ carIdx: 3 }),
      ],
      lapDistPct: [0.2, 0.19, 0.199, 0.195],
    });

    expect(cars.map((car) => car.carIdx)).toEqual([2, 3, 1]);
  });

  it('reports nothing when the player is not on track', () => {
    expect(
      run({
        drivers: [buildDriver({ carIdx: 1 })],
        lapDistPct: [-1, 0.199],
      }),
    ).toEqual([]);
  });
});
