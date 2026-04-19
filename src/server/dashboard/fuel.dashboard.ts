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
import { isRaceSession } from '#repository/session-info.repository.ts';
import type { FuelRefill } from '#schema/fuel.schema.ts';
import {
  computeEstimatedTimeRemaining,
  computeFuelRefill,
  getOverallLeaderCarIdx,
} from '#service/fuel.service.ts';

const getLeaderCarIdx = (positions: number[], playerCarIdx: number): number => {
  if (isRaceSession()) {
    const leaderCarIdx = getOverallLeaderCarIdx(positions);
    return leaderCarIdx === null ? playerCarIdx : leaderCarIdx;
  }

  return playerCarIdx;
};

const computeLapsRemaining = (
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

  return (
    Math.ceil(playerLapDistPct + estimatedTimeRemaining / playerMedianLapTime) -
    playerLapDistPct
  );
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
    positions,
    timeRemaining,
    flags,
  ] = await Promise.all([
    getCarsIdx(),
    getLapsCompleted(),
    getFuelLevel(),
    getLastLapTime(),
    getLapDistPct(),
    getOverallPositions(),
    getSessionTimeRemain(),
    getSessionFlags(),
  ]);

  const playerLastLapNumber = lapsCompleted[playerCarIdx];
  updateFuelTracking(fuelLevel, playerLastLapNumber);
  updateLapTimeTracking(carsIdx, lapsCompleted, lastLapTimes);

  const leaderCarIdx = getLeaderCarIdx(positions, playerCarIdx);

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
    timeRemaining,
  };
};
