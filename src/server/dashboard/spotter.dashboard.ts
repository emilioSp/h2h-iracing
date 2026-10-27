import { CAR_LEFT_RIGHT } from '#common/constants/car-left-right.ts';
// Computes the spotter payload for callers that have checked the repository connection.
import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import type { Spotter } from '#schema/spotter.schema.ts';
import { computeOverlap } from '#server/utils/compute-overlap.ts';
import { findNearestDeltaMeters } from '#service/spotter.service.ts';

const CLEAR: Spotter = { left: null, right: null, isThreeWide: false };

const THREE_WIDE: Spotter = { left: null, right: null, isThreeWide: true };

export const computeSpotter = async (): Promise<Spotter> => {
  const playerCarIdx = await irsdkRepository.getPlayerCarIdx();

  const side = await irsdkRepository.getCarLeftRight();

  if (side === CAR_LEFT_RIGHT.OFF || side === CAR_LEFT_RIGHT.CLEAR) return CLEAR;

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
    carsIdx: await driverRepository.getCarsIdx(),
    lapDistPct: await irsdkRepository.getLapDistPct(),
    onPitRoad: await irsdkRepository.getOnPitRoad(),
    trackLengthMeters: await irsdkRepository.getTrackLengthMeters(),
  });

  if (deltaMeters === null) return CLEAR;

  const overlap = computeOverlap(deltaMeters);

  return {
    left: side === CAR_LEFT_RIGHT.CAR_LEFT ? overlap : null,
    right: side === CAR_LEFT_RIGHT.CAR_RIGHT ? overlap : null,
    isThreeWide: false,
  };
};
