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
  ] = await Promise.all([
    getCarsIdx(),
    getLapsCompleted(),
    getFuelLevel(),
    getLastLapTime(),
    getLapDistPct(),
    getOverallPositions(),
    getSessionTimeRemain(),
  ]);

  const playerLastLapNumber = lapsCompleted[playerCarIdx];
  updateFuelTracking(fuelLevel, playerLastLapNumber);
  updateLapTimeTracking(carsIdx, lapsCompleted, lastLapTimes);

  const leaderCarIdx = getLeaderCarIdx(positions, playerCarIdx);

  const leaderMedianLapTime = getMedianLapTime(leaderCarIdx);
  const playerMedianLapTime = getMedianLapTime(playerCarIdx);
  const medianFuelPerLap = getMedianFuelPerLap();

  const estimatedTimeRemaining =
    leaderMedianLapTime === null
      ? null
      : computeEstimatedTimeRemaining(
          timeRemaining,
          leaderMedianLapTime,
          lapDistPct[leaderCarIdx],
        );

  // lapsRemaining accounts for the player's current lap progress: the player's
  // checkered is on their next S/F crossing AFTER the leader takes checkered,
  // so the naive `estimatedTimeRemaining / playerMedianLapTime` understates
  // the lap-distance the player actually covers.
  //
  // Let lapDistance = estimatedTimeRemaining / playerMedianLapTime
  // Correct lapsRemaining = ceil(playerLapDistPct + lapDistance) - playerLapDistPct
  // LapsRemaining is intentionally fractional: it's the lap-distance the player still has to cover, used directly by the fuel calculation.
  const lapsRemaining =
    estimatedTimeRemaining === null || playerMedianLapTime === null
      ? null
      : Math.ceil(
          lapDistPct[playerCarIdx] +
            estimatedTimeRemaining / playerMedianLapTime,
        ) - lapDistPct[playerCarIdx];

  const fuelLastLap = getLastLapFuelDelta();

  return {
    ...computeFuelRefill(fuelLevel, medianFuelPerLap, lapsRemaining),
    estimatedTimeRemaining,
    lapsRemaining:
      lapsRemaining === null ? null : parseFloat(lapsRemaining.toFixed(2)),
    medianFuelPerLap,
    fuelLevel,
    fuelLastLap,
    lastLapNumber: playerLastLapNumber,
    timeRemaining,
  };
};
