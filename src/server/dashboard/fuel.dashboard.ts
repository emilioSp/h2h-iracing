import { getCarsIdx } from '#repository/driver.repository.ts';
import {
  getLastLapFuelDelta,
  getMedianFuelPerLap,
  updateFuelTracking,
} from '#repository/fuel.repository.ts';
import {
  getFuelLevel,
  getLapDistPct,
  getLapsCompleted,
  getLastLapTime,
  getOverallPositions,
  getPlayerCarIdx,
  getSessionFlags,
  getSessionTimeRemain,
} from '#repository/irsdk.repository.ts';
import {
  getMedianLapTime,
  updateLapTimeTracking,
} from '#repository/lap.repository.ts';
import {
  isCheckeredFlag,
  isRaceSession,
} from '#repository/session-info.repository.ts';
import type { FuelRefill } from '#schema/fuel.schema.ts';
import {
  computeEstimatedTimeRemaining,
  computeFuelRefill,
} from '#service/fuel.service.ts';

const getLeaderCarIdx = async (): Promise<number> => {
  const overallPositions = await getOverallPositions();
  return overallPositions.indexOf(1);
};

export const computeLapsRemaining = (
  estimatedTimeRemaining: number | null,
  playerMedianLapTime: number | null,
  playerLapDistPct: number,
): number | null => {
  // Let lapDistance = estimatedTimeRemaining / playerMedianLapTime
  // Correct lapsRemaining = ceil(playerLapDistPct + lapDistance) - playerLapDistPct
  // LapsRemaining is intentionally fractional: it's the lap-distance the player still has to cover, used directly by the fuel calculation.
  if (estimatedTimeRemaining === null || playerMedianLapTime === null) {
    return null;
  }

  // Round to the 8th decimal digit to remove precision error
  const projectedTotalLaps =
    Math.round(
      (playerLapDistPct + estimatedTimeRemaining / playerMedianLapTime) * 1e8,
    ) / 1e8;

  // final lap minus the position where I am
  return Math.ceil(projectedTotalLaps) - playerLapDistPct;
};

export const computeFuel = async (): Promise<FuelRefill | null> => {
  const playerCarIdx = await getPlayerCarIdx();
  if (playerCarIdx < 0) return null;

  const [
    carsIdx,
    lapsCompleted,
    fuelLevel,
    lastLapTimes,
    lapDistPct,
    timeRemaining,
    flags,
  ] = await Promise.all([
    getCarsIdx(),
    getLapsCompleted(),
    getFuelLevel(),
    getLastLapTime(),
    getLapDistPct(),
    getSessionTimeRemain(),
    getSessionFlags(),
  ]);

  const playerLastLapNumber = lapsCompleted[playerCarIdx];
  updateFuelTracking(fuelLevel, playerLastLapNumber);
  updateLapTimeTracking(carsIdx, lapsCompleted, lastLapTimes);

  const leaderCarIdx = isRaceSession() ? await getLeaderCarIdx() : playerCarIdx;

  const leaderMedianLapTime = getMedianLapTime(leaderCarIdx);
  const playerMedianLapTime = getMedianLapTime(playerCarIdx);
  const medianFuelPerLap = getMedianFuelPerLap();

  const estimatedTimeRemaining = computeEstimatedTimeRemaining(
    timeRemaining,
    flags,
    leaderMedianLapTime,
    playerMedianLapTime,
    lapDistPct[leaderCarIdx],
  );

  const lapsRemaining = computeLapsRemaining(
    estimatedTimeRemaining,
    playerMedianLapTime,
    lapDistPct[playerCarIdx],
  );

  const fuelLastLap = getLastLapFuelDelta();

  return {
    ...computeFuelRefill(fuelLevel, medianFuelPerLap, lapsRemaining),
    estimatedTimeRemaining,
    lapsRemaining,
    medianFuelPerLap,
    fuelLevel,
    fuelLastLap,
    lastLapNumber: playerLastLapNumber === -1 ? null : playerLastLapNumber,
    timeRemaining: isCheckeredFlag(flags) ? 0 : timeRemaining,
  };
};
