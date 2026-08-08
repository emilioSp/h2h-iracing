import type { SpotterSide } from '#schema/spotter.schema.ts';

export const CAR_LENGTH_METERS = 4.8;

type GetDeltaMetersInput = {
  playerPct: number;
  otherDriverPct: number;
  trackLengthMeters: number;
};

export const getDeltaMeters = ({
  playerPct,
  otherDriverPct,
  trackLengthMeters,
}: GetDeltaMetersInput): number => {
  // Lap position is a loop: 0% and 100% are the same point on track.
  // Two cars are side by side across the line read 0.9999 and 0.0001 -> a raw diff of
  // -0.9998, nearly a full lap, instead of the real ~1 m. Any diff over
  // half a lap wrapped, so take the short way round.
  let diff = otherDriverPct - playerPct;
  if (diff > 0.5) diff -= 1;
  if (diff < -0.5) diff += 1;
  return diff * trackLengthMeters;
};

const clampPct = (value: number): number => Math.min(100, Math.max(0, value));

export const computeOverlap = (deltaMeters: number): SpotterSide => {
  const deltaPct = (deltaMeters / CAR_LENGTH_METERS) * 100;

  return {
    overlapStartPct: clampPct(deltaPct),
    overlapEndPct: clampPct(100 + deltaPct),
  };
};

type FindNearestDeltaMetersInput = {
  playerCarIdx: number;
  carsIdx: number[];
  lapDistPct: number[];
  onPitRoad: number[];
  trackLengthMeters: number;
};

export const findNearestDeltaMeters = ({
  playerCarIdx,
  carsIdx,
  lapDistPct,
  onPitRoad,
  trackLengthMeters,
}: FindNearestDeltaMetersInput): number | null => {
  const playerPct = lapDistPct[playerCarIdx];
  if (playerPct === undefined || playerPct < 0 || trackLengthMeters <= 0) {
    return null;
  }

  let nearest: number | null = null;

  for (const carIdx of carsIdx) {
    if (carIdx === playerCarIdx) continue;
    if (onPitRoad[carIdx] === 1) continue;

    const otherDriverPct = lapDistPct[carIdx];
    if (otherDriverPct === undefined || otherDriverPct < 0) continue;

    const delta = getDeltaMeters({
      playerPct,
      otherDriverPct,
      trackLengthMeters,
    });

    if (nearest === null || Math.abs(delta) < Math.abs(nearest)) {
      nearest = delta;
    }
  }

  return nearest;
};
