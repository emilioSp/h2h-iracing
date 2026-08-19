import { describe, expect, it } from 'vitest';
import {
  CAR_LENGTH_METERS,
  computeOverlap,
  findNearestDeltaMeters,
  getDeltaMeters,
} from '#service/spotter.service.ts';

const TRACK_LENGTH_METERS = 5000;

describe('getDeltaMeters', () => {
  it.each([
    {
      scenario: 'the other car is one meter ahead',
      playerPct: 0.5,
      otherDriverPct: 0.5002,
      expected: 1,
    },
    {
      scenario: 'the other car is one meter behind',
      playerPct: 0.5,
      otherDriverPct: 0.4998,
      expected: -1,
    },
    {
      scenario: 'the other car is ahead across the finish line',
      playerPct: 0.9999,
      otherDriverPct: 0.0001,
      expected: 1,
    },
    {
      scenario: 'the other car is behind across the finish line',
      playerPct: 0.0001,
      otherDriverPct: 0.9999,
      expected: -1,
    },
  ])('When $scenario then the shortest track distance is returned', ({
    playerPct,
    otherDriverPct,
    expected,
  }) => {
    const delta = getDeltaMeters({
      playerPct,
      otherDriverPct,
      trackLengthMeters: TRACK_LENGTH_METERS,
    });

    expect(delta).toBeCloseTo(expected, 5);
  });
});

describe('computeOverlap', () => {
  it.each([
    {
      scenario: 'the cars are side by side',
      deltaMeters: 0,
      expected: { overlapStartPct: 0, overlapEndPct: 100 },
    },
    {
      scenario: 'the other car is half a length ahead',
      deltaMeters: CAR_LENGTH_METERS / 2,
      expected: { overlapStartPct: 50, overlapEndPct: 100 },
    },
    {
      scenario: 'the other car is half a length behind',
      deltaMeters: -CAR_LENGTH_METERS / 2,
      expected: { overlapStartPct: 0, overlapEndPct: 50 },
    },
    {
      scenario: 'the other car is exactly one length ahead',
      deltaMeters: CAR_LENGTH_METERS,
      expected: { overlapStartPct: 100, overlapEndPct: 100 },
    },
    {
      scenario: 'the other car is exactly one length behind',
      deltaMeters: -CAR_LENGTH_METERS,
      expected: { overlapStartPct: 0, overlapEndPct: 0 },
    },
    {
      scenario: 'the other car is more than one length ahead',
      deltaMeters: CAR_LENGTH_METERS * 3,
      expected: { overlapStartPct: 100, overlapEndPct: 100 },
    },
    {
      scenario: 'the other car is more than one length behind',
      deltaMeters: -CAR_LENGTH_METERS * 3,
      expected: { overlapStartPct: 0, overlapEndPct: 0 },
    },
  ])('When $scenario then the overlap remains within the bar', ({
    deltaMeters,
    expected,
  }) => {
    expect(computeOverlap(deltaMeters)).toEqual(expected);
  });
});

describe('findNearestDeltaMeters', () => {
  it('When iRacing reports two nearby cars then the closest distance is returned', () => {
    const delta = findNearestDeltaMeters({
      playerCarIdx: 0,
      carsIdx: [0, 1, 2],
      onPitRoad: [false, false, false],
      trackLengthMeters: TRACK_LENGTH_METERS,
      lapDistPct: [0.5, 0.5008, 0.5002],
    });

    expect(delta).toBeCloseTo(1, 5);
  });

  it('When iRacing reports only the player car then no neighbour is returned', () => {
    const delta = findNearestDeltaMeters({
      playerCarIdx: 0,
      carsIdx: [0],
      onPitRoad: [false],
      trackLengthMeters: TRACK_LENGTH_METERS,
      lapDistPct: [0.5],
    });

    expect(delta).toBeNull();
  });

  it('When iRacing reports a nearby car on pit road then that car is excluded', () => {
    const delta = findNearestDeltaMeters({
      playerCarIdx: 0,
      carsIdx: [0, 1],
      onPitRoad: [false, true],
      trackLengthMeters: TRACK_LENGTH_METERS,
      lapDistPct: [0.5, 0.5002],
    });

    expect(delta).toBeNull();
  });

  it('When iRacing reports distant cars then the nearest distance is still returned', () => {
    const delta = findNearestDeltaMeters({
      playerCarIdx: 0,
      carsIdx: [0, 1, 2],
      onPitRoad: [false, false, false],
      trackLengthMeters: TRACK_LENGTH_METERS,
      lapDistPct: [0.5, 0.52, 0.49],
    });

    expect(delta).toBeCloseTo(-50, 5);
  });

  it('When iRacing reports other cars off track then no neighbour is returned', () => {
    const delta = findNearestDeltaMeters({
      playerCarIdx: 0,
      carsIdx: [0, 1, 2],
      onPitRoad: [false, false, false],
      trackLengthMeters: TRACK_LENGTH_METERS,
      lapDistPct: [0.5, -1, -1],
    });

    expect(delta).toBeNull();
  });

  it('When iRacing reports the player off track then no neighbour is returned', () => {
    const delta = findNearestDeltaMeters({
      playerCarIdx: 0,
      carsIdx: [0, 1, 2],
      onPitRoad: [false, false, false],
      trackLengthMeters: TRACK_LENGTH_METERS,
      lapDistPct: [-1, 0.5, 0.5],
    });

    expect(delta).toBeNull();
  });

  it('When iRacing reports no track length then no neighbour is returned', () => {
    const delta = findNearestDeltaMeters({
      playerCarIdx: 0,
      carsIdx: [0, 1, 2],
      onPitRoad: [false, false, false],
      trackLengthMeters: 0,
      lapDistPct: [0.5, 0.5002, 0.5008],
    });

    expect(delta).toBeNull();
  });

  it('When iRacing reports a neighbour across the finish line then the wrapped distance is returned', () => {
    const delta = findNearestDeltaMeters({
      playerCarIdx: 0,
      carsIdx: [0, 1, 2],
      onPitRoad: [false, false, false],
      trackLengthMeters: TRACK_LENGTH_METERS,
      lapDistPct: [0.9998, 0.0002, 0.4],
    });

    expect(delta).toBeCloseTo(2, 5);
  });
});
