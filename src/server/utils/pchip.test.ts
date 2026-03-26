import { describe, expect, it } from 'vitest';
import type { ReferenceLap, ReferencePoint } from '#utils/pchip.ts';
import {
  interpolateAtPoint,
  normalizeKey,
  precomputePCHIPTangents,
  REFERENCE_INTERVAL,
} from '#utils/pchip.ts';

const makePoint = (trackPct: number, time: number): ReferencePoint => ({
  trackPct,
  timeElapsedSinceStart: time,
  tangent: undefined,
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
  isCleanLap: true,
});

describe('normalizeKey', () => {
  it('returns 0 for key = 0', () => {
    expect(normalizeKey(0)).toBe(0);
  });

  it('returns the key unchanged when it falls exactly on a boundary', () => {
    // x % x === 0 is always exact in IEEE 754, so REFERENCE_INTERVAL is a safe boundary to test
    expect(normalizeKey(REFERENCE_INTERVAL)).toBe(REFERENCE_INTERVAL);
  });

  it('truncates to the nearest REFERENCE_INTERVAL boundary below', () => {
    const keyBetweenBoundaries = 0.003; // between 0.0025 and 0.005
    expect(normalizeKey(keyBetweenBoundaries)).toBe(0.0025);
  });

  it('returns 0 for negative input', () => {
    expect(normalizeKey(-0.1)).toBe(0);
  });
});

describe('precomputePCHIPTangents', () => {
  it('does nothing when the lap has fewer than 2 points', () => {
    const point = makePoint(0.5, 50);
    const lap = makeLap([[0.5, point]]);

    precomputePCHIPTangents(lap);

    expect(point.tangent).toBeUndefined();
  });

  it('sets a finite numeric tangent on every point', () => {
    const points: Array<[number, ReferencePoint]> = [
      [0.0, makePoint(0.0, 0)],
      [0.25, makePoint(0.25, 25)],
      [0.5, makePoint(0.5, 50)],
      [0.75, makePoint(0.75, 75)],
    ];
    const lap = makeLap(points, 0, 100);

    precomputePCHIPTangents(lap);

    for (const [, point] of points) {
      expect(typeof point.tangent).toBe('number');
      expect(Number.isFinite(point.tangent)).toBe(true);
    }
  });

  it('sets tangents equal to the slope for a perfectly linear lap', () => {
    // PCHIP preserves linear data exactly: all tangents must equal the constant slope.
    const lapTime = 100;
    const slope = lapTime; // time = trackPct * 100 → dt/dpct = 100
    const points: Array<[number, ReferencePoint]> = [
      [0.0, makePoint(0.0, 0)],
      [0.25, makePoint(0.25, 25)],
      [0.5, makePoint(0.5, 50)],
      [0.75, makePoint(0.75, 75)],
    ];
    const lap = makeLap(points, 0, lapTime);

    precomputePCHIPTangents(lap);

    for (const [, point] of points) {
      expect(point.tangent).toBeCloseTo(slope, 5);
    }
  });
});

describe('interpolateAtPoint', () => {
  it('returns null when no refPoint exists at the target position', () => {
    const lap = makeLap([[0.5, makePoint(0.5, 50)]]);

    expect(interpolateAtPoint(lap, 0.3)).toBeNull();
  });

  it('returns the p0 time when no next point exists', () => {
    // Near end of track: key1 = normalizeKey(0.9975 + REFERENCE_INTERVAL) = normalizeKey(1.0) = 0,
    // which is absent from the map.
    const trackPct = 0.9975;
    const time = 99.75;
    const lap = makeLap([[trackPct, makePoint(trackPct, time)]]);

    expect(interpolateAtPoint(lap, trackPct)).toBe(time);
  });

  it('linearly interpolates between two points when tangents are undefined', () => {
    const p0 = makePoint(0.0, 0);
    const p1 = makePoint(REFERENCE_INTERVAL, 10);
    const lap = makeLap([
      [0.0, p0],
      [REFERENCE_INTERVAL, p1],
    ]);
    const midPct = REFERENCE_INTERVAL / 2;

    expect(interpolateAtPoint(lap, midPct)).toBeCloseTo(5, 10);
  });

  it('returns the stored time at an exact key after PCHIP precomputation', () => {
    // Hermite basis at t=0 always returns y0 exactly, so querying at a stored key is a clean
    // integration check that precomputePCHIPTangents ran without corrupting the stored times.
    const lapTime = 100;
    const entries: Array<[number, ReferencePoint]> = [];
    for (let i = 0; i < 400; i++) {
      const pct = i * REFERENCE_INTERVAL;
      entries.push([pct, makePoint(pct, pct * lapTime)]);
    }
    const lap = makeLap(entries, 0, lapTime);
    precomputePCHIPTangents(lap);

    const storedPct = 200 * REFERENCE_INTERVAL; // pct=0.5, time=50
    expect(interpolateAtPoint(lap, storedPct)).toBeCloseTo(
      storedPct * lapTime,
      5,
    );
  });

  it('wraps time correctly when interpolating across the finish line', () => {
    // p0 near the end of the track, p1 at the start (wrap-around segment).
    // Tangents are set manually to match a linear lap (slope = lapTime).
    const lapTime = 100;
    const slope = lapTime;
    const p0: ReferencePoint = {
      trackPct: 0.9975,
      timeElapsedSinceStart: 99.75,
      tangent: slope,
    };
    const p1: ReferencePoint = {
      trackPct: 0,
      timeElapsedSinceStart: 0,
      tangent: slope,
    };
    const lap = makeLap(
      [
        [0.9975, p0],
        [0, p1],
      ],
      0,
      lapTime,
    );

    const targetPct = 0.9975 + REFERENCE_INTERVAL / 2; // 0.99875, midway through the wrap segment
    const expected = 99.875;

    expect(interpolateAtPoint(lap, targetPct)).toBeCloseTo(expected, 3);
  });
});
