// Computes the visible overlap segment when a car is alongside.
import type { SpotterSide } from '#schema/spotter.schema.ts';

export const CAR_LENGTH_METERS = 4.8;

const clampPct = (value: number): number => Math.min(100, Math.max(0, value));

export const computeOverlap = (deltaMeters: number): SpotterSide => {
  const deltaPct = (deltaMeters / CAR_LENGTH_METERS) * 100;

  return {
    overlapStartPct: clampPct(deltaPct),
    overlapEndPct: clampPct(100 + deltaPct),
  };
};
