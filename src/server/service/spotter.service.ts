import type { SpotterSide } from '#schema/spotter.schema.ts';
import { wrapLapDelta } from '#server/utils/track-position.ts';

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
}: GetDeltaMetersInput): number =>
  wrapLapDelta(otherDriverPct - playerPct) * trackLengthMeters;

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
