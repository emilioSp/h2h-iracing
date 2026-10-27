// Finds the nearest on-track neighbour when the spotter estimates overlap.
import { getDeltaMeters } from '#server/utils/delta-meters.ts';

type FindNearestDeltaMetersInput = {
  playerCarIdx: number;
  carsIdx: number[];
  lapDistPct: number[];
  onPitRoad: boolean[];
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

    if (onPitRoad[carIdx]) continue;

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
