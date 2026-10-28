// Computes the fuel payload for callers that have checked the repository connection.
import driverRepository from '#repository/driver.repository.ts';
import fuelRepository from '#repository/fuel.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import lapRepository from '#repository/lap.repository.ts';
import sessionInfoRepository from '#repository/session-info.repository.ts';
import type { FuelRefill } from '#schema/fuel.schema.ts';
import { computeLapsRemaining } from '#server/utils/compute-laps-remaining.ts';
import { isCheckeredFlag } from '#server/utils/is-checkered-flag.ts';
import { computeEstimatedTimeRemaining } from '#service/estimated-time-remaining.service.ts';
import { computeFuelRefill } from '#service/fuel.service.ts';

const getLeaderCarIdx = async (): Promise<number> => {
  const overallPositions = await irsdkRepository.getOverallPositions();

  return overallPositions.indexOf(1);
};

export const computeFuel = async (): Promise<FuelRefill> => {
  const playerCarIdx = await irsdkRepository.getPlayerCarIdx();

  const [carsIdx, lapsCompleted, fuelLevel, lastLapTimes, lapDistPct, timeRemaining, flags] =
    await Promise.all([
      driverRepository.getCarsIdx(),
      irsdkRepository.getLapsCompleted(),
      irsdkRepository.getFuelLevel(),
      irsdkRepository.getLastLapTime(),
      irsdkRepository.getLapDistPct(),
      irsdkRepository.getSessionTimeRemain(),
      irsdkRepository.getSessionFlags(),
    ]);

  const playerLastLapNumber = lapsCompleted[playerCarIdx];
  fuelRepository.updateFuelTracking({ fuelLevel, playerLapCompleted: playerLastLapNumber });
  lapRepository.updateLapTimeTracking({ carsIdx, lapsCompleted, lastLapTimes });

  const leaderCarIdx = sessionInfoRepository.isRaceSession()
    ? await getLeaderCarIdx()
    : playerCarIdx;

  const leaderMedianLapTime = lapRepository.getMedianLapTime(leaderCarIdx);
  const playerMedianLapTime = lapRepository.getMedianLapTime(playerCarIdx);
  const medianFuelPerLap = fuelRepository.getMedianFuelPerLap();

  const estimatedTimeRemaining = computeEstimatedTimeRemaining({
    timeRemaining,
    flags,
    leaderMedianLapTime,
    playerMedianLapTime,
    leaderLapDistPct: lapDistPct[leaderCarIdx],
  });

  const lapsRemaining = computeLapsRemaining({
    estimatedTimeRemaining,
    playerMedianLapTime,
    playerLapDistPct: lapDistPct[playerCarIdx],
  });

  const fuelLastLap = fuelRepository.getLastLapFuelDelta();

  return {
    ...computeFuelRefill({ fuelLevel, medianFuelPerLap, lapsRemaining }),
    estimatedTimeRemaining,
    lapsRemaining,
    medianFuelPerLap,
    fuelLevel,
    fuelLastLap,
    lastLapNumber: playerLastLapNumber === -1 ? null : playerLastLapNumber,
    timeRemaining: isCheckeredFlag(flags) ? 0 : timeRemaining,
  };
};
