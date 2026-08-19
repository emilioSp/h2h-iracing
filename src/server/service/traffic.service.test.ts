import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addRecentLap,
  type ReferenceLap,
  type ReferencePoint,
  resetReferenceLaps,
} from '#repository/reference-lap.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';
import * as gapDelta from '#server/utils/gap-delta.ts';
import {
  getReferenceInterval,
  initReferenceInterval,
} from '#service/reference-lap.service.ts';
import {
  FASTER_CLASS_MARGIN_SECONDS,
  findTrafficBehind,
  isFasterCar,
} from '#service/traffic.service.ts';

const PLAYER_ESTIMATED_LAP_TIME = 103.1952;
const PLAYER_CAR_IDX = 0;
const TEST_TRACK_LENGTH_METERS = 1280;
const REFERENCE_LAP_SECONDS = 100;

const fasterDriver: Driver = {
  carIdx: 1,
  name: 'Faster Driver',
  carNumber: '1',
  car: 'Dallara P217 LMP2',
  iRating: 3000,
  license: 'A 3.51',
  classEstLapTime: 94.5768,
};

const createReferenceLap = (): ReferenceLap => {
  const interval = getReferenceInterval();
  const refPoints = new Map<number, ReferencePoint>();

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

describe('isFasterCar', () => {
  it.each([
    {
      scenario: 'a car is a full class faster',
      carClassEstLapTime: 94.5768,
      expected: true,
    },
    {
      scenario: 'a car in the same class is only 0.6 seconds faster',
      carClassEstLapTime: 102.5469,
      expected: false,
    },
    {
      scenario: 'a car is slower over a lap',
      carClassEstLapTime: 106.3155,
      expected: false,
    },
    {
      scenario: 'a car has no estimated lap time',
      carClassEstLapTime: 0,
      expected: false,
    },
    {
      scenario: 'a car is exactly on the faster-class margin',
      carClassEstLapTime:
        PLAYER_ESTIMATED_LAP_TIME - FASTER_CLASS_MARGIN_SECONDS,
      expected: true,
    },
  ])('When $scenario then the faster-car result is $expected', ({
    carClassEstLapTime,
    expected,
  }) => {
    expect(
      isFasterCar({
        carClassEstLapTime,
        playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      }),
    ).toBe(expected);
  });
});

describe('findTrafficBehind', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    initReferenceInterval(TEST_TRACK_LENGTH_METERS);
    resetReferenceLaps();
  });

  it('When iRacing reports a faster car just behind then the car is returned with its estimated gap', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.199],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([
      {
        carIdx: 1,
        carNumber: '1',
        driverName: 'Faster Driver',
        className: 'LMP2',
        license: 'A 3.51',
        iRating: 3000,
        gapSeconds: expect.closeTo(0.0946, 3),
      },
    ]);
  });

  it('When iRacing includes the player in the driver list then the player is excluded', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [{ ...fasterDriver, carIdx: PLAYER_CAR_IDX }],
      lapDistPct: [0.2],
      lapsCompleted: [0],
      onPitRoad: [false],
    });

    expect(cars).toEqual([]);
  });

  it('When iRacing reports a faster car in the pits then the car is excluded', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.199],
      lapsCompleted: [0, 0],
      onPitRoad: [false, true],
    });

    expect(cars).toEqual([]);
  });

  it('When iRacing reports a faster car not on track then the car is excluded', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, -1],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });

  it('When iRacing reports a car from the same class then the car is excluded', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [{ ...fasterDriver, classEstLapTime: 102.5469 }],
      lapDistPct: [0.2, 0.199],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });

  it('When iRacing reports a faster car in front then the car is excluded', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.21],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });

  it('When iRacing reports a faster car behind across the start line then the car is included', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.005, 0.999],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars.map((car) => car.carIdx)).toEqual([1]);
  });

  it('When iRacing reports a faster car in front across the start line then the car is excluded', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.999, 0.005],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });

  it('When iRacing reports a faster car outside the traffic window then the car is excluded', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.15],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });

  it('When iRacing reports enough completed laps then the reference lap provides the gap', () => {
    addRecentLap({ carIdx: 1, lap: createReferenceLap() });
    const referenceDelta = vi.spyOn(gapDelta, 'referenceDelta');

    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.19],
      lapsCompleted: [4, 4],
      onPitRoad: [false, false],
    });

    expect(cars[0].gapSeconds).toBeCloseTo(1, 5);
    expect(referenceDelta).toHaveBeenCalled();
  });

  it('When iRacing reports too few completed laps then the estimated lap time provides the gap', () => {
    addRecentLap({ carIdx: 1, lap: createReferenceLap() });
    const estimatedDelta = vi.spyOn(gapDelta, 'estimatedDelta');

    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.19],
      lapsCompleted: [1, 1],
      onPitRoad: [false, false],
    });

    expect(cars[0].gapSeconds).toBeCloseTo(0.9458, 3);
    expect(estimatedDelta).toHaveBeenCalled();
  });

  it('When iRacing reports three faster cars behind then the nearest car is first', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [
        fasterDriver,
        { ...fasterDriver, carIdx: 2, carNumber: '2' },
        { ...fasterDriver, carIdx: 3, carNumber: '3' },
      ],
      lapDistPct: [0.2, 0.19, 0.199, 0.195],
      lapsCompleted: [0, 0, 0, 0],
      onPitRoad: [false, false, false, false],
    });

    expect(cars.map((car) => car.carIdx)).toEqual([2, 3, 1]);
  });

  it('When iRacing reports the player not on track then no traffic is returned', () => {
    const cars = findTrafficBehind({
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [-1, 0.199],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });
});
