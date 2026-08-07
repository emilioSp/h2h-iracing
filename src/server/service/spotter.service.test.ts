import { describe, expect, it } from 'vitest';
import {
  CAR_LENGTH_METERS,
  computeOverlap,
  findNearestDelta,
  getDeltaMeters,
} from '#service/spotter.service.ts';

const TRACK_LENGTH_METERS = 5000;

describe('getDeltaMeters', () => {
  it('returns a positive delta when the other car is ahead', () => {
    const delta = getDeltaMeters({
      playerPct: 0.5,
      otherDriverPct: 0.5002,
      trackLengthMeters: TRACK_LENGTH_METERS,
    });

    expect(delta).toBeCloseTo(1, 5);
  });

  it('returns a negative delta when the other car is behind', () => {
    const delta = getDeltaMeters({
      playerPct: 0.5,
      otherDriverPct: 0.4998,
      trackLengthMeters: TRACK_LENGTH_METERS,
    });

    expect(delta).toBeCloseTo(-1, 5);
  });

  it('takes the short way round when the other car just crossed the line', () => {
    const delta = getDeltaMeters({
      playerPct: 0.999,
      otherDriverPct: 0.001,
      trackLengthMeters: TRACK_LENGTH_METERS,
    });

    expect(delta).toBeCloseTo(10, 5);
  });

  it('takes the short way round when the player just crossed the line', () => {
    const delta = getDeltaMeters({
      playerPct: 0.001,
      otherDriverPct: 0.999,
      trackLengthMeters: TRACK_LENGTH_METERS,
    });

    expect(delta).toBeCloseTo(-10, 5);
  });
});

describe('computeOverlap', () => {
  it('fills the whole bar when the cars are side by side', () => {
    expect(computeOverlap(0)).toEqual({
      overlapStartPct: 0,
      overlapEndPct: 100,
    });
  });

  it('covers the front half when the other car is half a length ahead', () => {
    const { overlapStartPct, overlapEndPct } = computeOverlap(
      CAR_LENGTH_METERS / 2,
    );

    expect(overlapStartPct).toBeCloseTo(50, 5);
    expect(overlapEndPct).toBeCloseTo(100, 5);
  });

  it('covers the rear half when the other car is half a length behind', () => {
    const { overlapStartPct, overlapEndPct } = computeOverlap(
      -CAR_LENGTH_METERS / 2,
    );

    expect(overlapStartPct).toBeCloseTo(0, 5);
    expect(overlapEndPct).toBeCloseTo(50, 5);
  });

  it('collapses to the nose when the other car is exactly one length ahead', () => {
    expect(computeOverlap(CAR_LENGTH_METERS)).toEqual({
      overlapStartPct: 100,
      overlapEndPct: 100,
    });
  });

  it('collapses to the tail when the other car is exactly one length behind', () => {
    expect(computeOverlap(-CAR_LENGTH_METERS)).toEqual({
      overlapStartPct: 0,
      overlapEndPct: 0,
    });
  });

  it('stays clamped beyond a full car length', () => {
    expect(computeOverlap(CAR_LENGTH_METERS * 3)).toEqual({
      overlapStartPct: 100,
      overlapEndPct: 100,
    });
    expect(computeOverlap(-CAR_LENGTH_METERS * 3)).toEqual({
      overlapStartPct: 0,
      overlapEndPct: 0,
    });
  });
});

describe('findNearestDelta', () => {
  const baseInput = {
    playerCarIdx: 0,
    carsIdx: [0, 1, 2],
    onPitRoad: [0, 0, 0],
    trackLengthMeters: TRACK_LENGTH_METERS,
  };

  it('returns the closest car', () => {
    const delta = findNearestDelta({
      ...baseInput,
      lapDistPct: [0.5, 0.5008, 0.5002],
    });

    expect(delta).toBeCloseTo(1, 5);
  });

  it('ignores the player own car', () => {
    const delta = findNearestDelta({
      ...baseInput,
      carsIdx: [0],
      lapDistPct: [0.5, 0.5002, 0.5002],
    });

    expect(delta).toBeNull();
  });

  it('ignores cars on pit road', () => {
    const delta = findNearestDelta({
      ...baseInput,
      carsIdx: [0, 1],
      onPitRoad: [0, 1, 0],
      lapDistPct: [0.5, 0.5002, 0.9],
    });

    expect(delta).toBeNull();
  });

  it('returns a distant car — CarLeftRight decides whether one is alongside', () => {
    const delta = findNearestDelta({
      ...baseInput,
      lapDistPct: [0.5, 0.52, 0.49],
    });

    expect(delta).toBeCloseTo(-50, 5);
  });

  it('ignores cars that are not on track', () => {
    const delta = findNearestDelta({
      ...baseInput,
      lapDistPct: [0.5, -1, -1],
    });

    expect(delta).toBeNull();
  });

  it('returns null when the player is not on track', () => {
    const delta = findNearestDelta({
      ...baseInput,
      lapDistPct: [-1, 0.5, 0.5],
    });

    expect(delta).toBeNull();
  });

  it('returns null when the track length is unknown', () => {
    const delta = findNearestDelta({
      ...baseInput,
      trackLengthMeters: 0,
      lapDistPct: [0.5, 0.5002, 0.5008],
    });

    expect(delta).toBeNull();
  });

  it('finds a neighbour across the start finish line', () => {
    const delta = findNearestDelta({
      ...baseInput,
      lapDistPct: [0.9998, 0.0002, 0.4],
    });

    expect(delta).toBeCloseTo(2, 5);
  });
});
