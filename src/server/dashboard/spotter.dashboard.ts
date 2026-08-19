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

export const computeSpotter = async (): Promise<Spotter> => {
  const playerCarIdx = await getPlayerCarIdx();
  if (playerCarIdx < 0) return CLEAR;

  const side = await getCarLeftRight();
  if (side === CAR_LEFT_RIGHT.OFF || side === CAR_LEFT_RIGHT.CLEAR)
    return CLEAR;

  // iRacing does not identify the cars when it reports a three-wide state.
  // Skip the overlap calculation and let the overlay show the warning.
  if (
    side === CAR_LEFT_RIGHT.CAR_LEFT_AND_RIGHT ||
    side === CAR_LEFT_RIGHT.TWO_CARS_LEFT ||
    side === CAR_LEFT_RIGHT.TWO_CARS_RIGHT
  ) {
    return THREE_WIDE;
  }

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
    left: side === CAR_LEFT_RIGHT.CAR_LEFT ? overlap : null,
    right: side === CAR_LEFT_RIGHT.CAR_RIGHT ? overlap : null,
    isThreeWide: false,
  };
};
