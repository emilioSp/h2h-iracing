import { getCarsIdx } from '#repository/driver.repository.ts';
import {
  CAR_LEFT_RIGHT,
  getCarLeftRight,
  getLapDistPct,
  getOnPitRoad,
  getPlayerCarIdx,
  getTrackLengthMeters,
} from '#repository/irsdk.repository.ts';
import type { Spotter } from '#schema/spotter.schema.ts';
import {
  computeOverlap,
  findNearestDeltaMeters,
} from '#service/spotter.service.ts';

const CLEAR: Spotter = { left: null, right: null, isThreeWide: false };
const THREE_WIDE: Spotter = { left: null, right: null, isThreeWide: true };

const isOnLeft = (side: number): boolean =>
  side === CAR_LEFT_RIGHT.CAR_LEFT || side === CAR_LEFT_RIGHT.TWO_CARS_LEFT;

const isOnRight = (side: number): boolean =>
  side === CAR_LEFT_RIGHT.CAR_RIGHT || side === CAR_LEFT_RIGHT.TWO_CARS_RIGHT;

// In the dump the player car has no neighbour. Car 2 is the only one with a
// car overlapping it (car 7, 4.24 m ahead), so mock mode races as car 2.
const MOCK_PLAYER_CAR_IDX = 2;

export const computeSpotter = async (): Promise<Spotter> => {
  const playerCarIdx =
    process.env.DATA_MODE === 'mock'
      ? MOCK_PLAYER_CAR_IDX
      : await getPlayerCarIdx();
  if (playerCarIdx < 0) return CLEAR;

  const side = await getCarLeftRight();
  if (side === CAR_LEFT_RIGHT.OFF || side === CAR_LEFT_RIGHT.CLEAR)
    return CLEAR;

  // iRacing does not say which car is on which side, so a per-side overlap
  // cannot be attributed. Skip the search and let the overlay flag the danger.
  if (side === CAR_LEFT_RIGHT.CAR_LEFT_AND_RIGHT) return THREE_WIDE;

  const deltaMeters = findNearestDeltaMeters({
    playerCarIdx,
    carsIdx: await getCarsIdx(),
    lapDistPct: await getLapDistPct(),
    onPitRoad: await getOnPitRoad(),
    trackLengthMeters: await getTrackLengthMeters(),
  });
  if (deltaMeters === null) return CLEAR;

  const overlap = computeOverlap(deltaMeters);

  return {
    left: isOnLeft(side) ? overlap : null,
    right: isOnRight(side) ? overlap : null,
    isThreeWide: false,
  };
};
