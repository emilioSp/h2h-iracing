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
  computeEstimatedDurationRaceEnd,
  computeFuelRefill,
  getOverallLeaderCarIdx,
} from '#service/fuel.service.ts';

export const computeFuel = async (): Promise<FuelRefill | null> => {
  const playerCarIdx = await getPlayerCarIdx();
  if (playerCarIdx < 0) return null;

  const [
    lapsCompleted,
    fuelLevel,
    lastLapTimes,
    lapDistPct,
    positions,
    timeRemaining,
  ] = await Promise.all([
    getLapsCompleted(),
    getFuelLevel(),
    getLastLapTime(),
    getLapDistPct(),
    getOverallPositions(),
    getSessionTimeRemain(),
  ]);

  const playerLastLapNumber = lapsCompleted[playerCarIdx];
  updateFuelTracking(fuelLevel, playerLastLapNumber);
  await updateLapTimeTracking(lapsCompleted, lastLapTimes);

  const leaderCarIdx = isRaceSession()
    ? getOverallLeaderCarIdx(positions)
    : playerCarIdx;

  // TODO: maybe we can fallback to playerCarIdx?
  if (leaderCarIdx === null) {
    return {
      fuelRefillNoMarginLap: null,
      fuelRefillForHalfMarginLap: null,
      fuelRefillFor1MarginLap: null,
      lapsRemaining: null,
      medianFuelPerLap: null,
      fuelLastLap: null,
      fuelLevel,
      lastLapNumber: playerLastLapNumber,
      estimatedDurationRaceEnd: null,
    };
  }

  const leaderMedianLapTime = getMedianLapTime(leaderCarIdx);
  const playerMedianLapTime = getMedianLapTime(playerCarIdx);
  const medianFuelPerLap = getMedianFuelPerLap();

  const estimatedDurationRaceEnd =
    leaderMedianLapTime === null
      ? null
      : computeEstimatedDurationRaceEnd(
          timeRemaining,
          leaderMedianLapTime,
          lapDistPct[leaderCarIdx],
        );

  // lapsRemaining accounts for the player's current lap progress: the player's
  // checkered is on their next S/F crossing AFTER the leader takes checkered,
  // so the naive `estimatedDurationRaceEnd / playerMedianLapTime` understates
  // the lap-distance the player actually covers.
  //
  // Let lapDistance = estimatedDurationRaceEnd / playerMedianLapTime
  // Correct lapsRemaining = ceil(playerLapDistPct + lapDistance) - playerLapDistPct
  const lapsRemaining =
    estimatedDurationRaceEnd === null || playerMedianLapTime === null
      ? null
      : Math.ceil(
          lapDistPct[playerCarIdx] +
            estimatedDurationRaceEnd / playerMedianLapTime,
        ) - lapDistPct[playerCarIdx];

  const fuelLastLap = getLastLapFuelDelta();

  return {
    ...computeFuelRefill(fuelLevel, medianFuelPerLap, lapsRemaining),
    estimatedDurationRaceEnd,
    lapsRemaining,
    medianFuelPerLap,
    fuelLevel,
    fuelLastLap,
    lastLapNumber: playerLastLapNumber,
  };
};
