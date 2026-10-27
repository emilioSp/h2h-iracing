// Verifies faster-class traffic detection during regression tests.
import { describe, expect, it } from 'vitest';

import { carClass } from '#common/constants/car-class.ts';
import { fasterDriver } from '#fixtures/faster-traffic-driver.ts';
import { trafficReferenceLap } from '#fixtures/traffic-reference-lap.ts';
import { FASTER_CLASS_MARGIN_SECONDS } from '#server/utils/is-faster-car.ts';
import { isFasterCar } from '#server/utils/is-faster-car.ts';
import { findTrafficBehind } from '#service/traffic.service.ts';

const PLAYER_ESTIMATED_LAP_TIME = 103.1952;

const PLAYER_CAR_IDX = 0;

const TEST_TRACK_LENGTH_METERS = 1280;

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
      carClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME - FASTER_CLASS_MARGIN_SECONDS,
      expected: true,
    },
  ])(
    'given $scenario when class pace is compared then the faster-car result is $expected',
    ({ carClassEstLapTime, expected }) => {
      expect(
        isFasterCar({
          carClassEstLapTime,
          playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
        }),
      ).toBe(expected);
    },
  );
});

describe('findTrafficBehind', () => {
  it('given iRacing reports a faster car just behind when traffic is detected then the car is returned with its estimated gap', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
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
        className: carClass.LMP2,
        license: 'A 3.51',
        iRating: 3000,
        gapSeconds: expect.closeTo(0.0946, 3),
      },
    ]);
  });

  it('given iRacing includes the player in the driver list when traffic is detected then the player is excluded', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [{ ...fasterDriver, carIdx: PLAYER_CAR_IDX }],
      lapDistPct: [0.2],
      lapsCompleted: [0],
      onPitRoad: [false],
    });

    expect(cars).toEqual([]);
  });

  it('given iRacing reports a faster car in the pits when traffic is detected then the car is excluded', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.199],
      lapsCompleted: [0, 0],
      onPitRoad: [false, true],
    });

    expect(cars).toEqual([]);
  });

  it('given iRacing reports a faster car not on track when traffic is detected then the car is excluded', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, -1],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });

  it('given iRacing reports a car from the same class when traffic is detected then the car is excluded', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [{ ...fasterDriver, classEstLapTime: 102.5469 }],
      lapDistPct: [0.2, 0.199],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });

  it('given iRacing reports a faster car in front when traffic is detected then the car is excluded', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.21],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });

  it('given iRacing reports a faster car behind across the start line when traffic is detected then the car is included', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.005, 0.999],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars.map((car) => car.carIdx)).toEqual([1]);
  });

  it('given iRacing reports a faster car in front across the start line when traffic is detected then the car is excluded', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.999, 0.005],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });

  it('given iRacing reports a faster car outside the traffic window when traffic is detected then the car is excluded', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.15],
      lapsCompleted: [0, 0],
      onPitRoad: [false, false],
    });

    expect(cars).toEqual([]);
  });

  it('given iRacing reports enough completed laps when traffic is detected then the reference lap provides the gap', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map([[1, trafficReferenceLap]]),
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.19],
      lapsCompleted: [4, 4],
      onPitRoad: [false, false],
    });

    expect(cars[0].gapSeconds).toBeCloseTo(1, 5);
  });

  it('given iRacing reports too few completed laps when traffic is detected then the estimated lap time provides the gap', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map([[1, trafficReferenceLap]]),
      playerCarIdx: PLAYER_CAR_IDX,
      playerClassEstLapTime: PLAYER_ESTIMATED_LAP_TIME,
      drivers: [fasterDriver],
      lapDistPct: [0.2, 0.19],
      lapsCompleted: [1, 1],
      onPitRoad: [false, false],
    });

    expect(cars[0].gapSeconds).toBeCloseTo(0.9458, 3);
  });

  it('given iRacing reports three faster cars behind when traffic is detected then the nearest car is first', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
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

  it('given iRacing reports the player not on track when traffic is detected then no traffic is returned', () => {
    const cars = findTrafficBehind({
      referenceInterval: 10 / TEST_TRACK_LENGTH_METERS,
      referenceLaps: new Map(),
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
