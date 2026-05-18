import { isCheckeredFlag } from '#repository/session-info.repository.ts';
import type { FuelRefill } from '#schema/fuel.schema.ts';

export type ComputeEstimatedTimeRemainingInput = {
  timeRemaining: number;
  flags: number;
  leaderMedianLapTime: number | null;
  playerMedianLapTime: number | null;
  leaderLapDistPct: number;
};

export const computeEstimatedTimeRemaining = ({
  timeRemaining,
  flags,
  leaderMedianLapTime,
  playerMedianLapTime,
  leaderLapDistPct,
}: ComputeEstimatedTimeRemainingInput): number | null => {
  if (isCheckeredFlag(flags)) return 0;
  if (playerMedianLapTime === null || leaderMedianLapTime === null) return null;

  const leaderTimeToFinishCurrentLap =
    (1 - leaderLapDistPct) * leaderMedianLapTime;

  // What will the official race clock read when the leader crosses the SF line?
  const leaderTimeRemainingAtNextSFCrossing =
    timeRemaining - leaderTimeToFinishCurrentLap;

  let remainingLaps = 0;

  // If leaderTimeRemainingAtNextSFCrossing < 0, time expires during the current lap.
  // This means the current lap is the white flag lap, so 0 additional laps.
  if (leaderTimeRemainingAtNextSFCrossing >= 0) {
    remainingLaps =
      Math.floor(leaderTimeRemainingAtNextSFCrossing / leaderMedianLapTime) + 1; // Add 1 is the white flag lap
  }

  return leaderTimeToFinishCurrentLap + remainingLaps * leaderMedianLapTime;
};

type FuelRefillFields = Pick<
  FuelRefill,
  | 'fuelRefillNoMarginLap'
  | 'fuelRefillForHalfMarginLap'
  | 'fuelRefillFor1MarginLap'
>;

export type ComputeFuelRefillInput = {
  fuelLevel: number;
  medianFuelPerLap: number | null;
  lapsRemaining: number | null;
};

export const computeFuelRefill = ({
  fuelLevel,
  medianFuelPerLap,
  lapsRemaining,
}: ComputeFuelRefillInput): FuelRefillFields => {
  if (medianFuelPerLap === null || lapsRemaining === null) {
    return {
      fuelRefillNoMarginLap: null,
      fuelRefillForHalfMarginLap: null,
      fuelRefillFor1MarginLap: null,
    };
  }

  const fuelToFinishRace = lapsRemaining * medianFuelPerLap;
  return {
    fuelRefillNoMarginLap: Math.max(0, fuelToFinishRace - fuelLevel),
    fuelRefillForHalfMarginLap: Math.max(
      0,
      fuelToFinishRace - fuelLevel + 0.5 * medianFuelPerLap,
    ),
    fuelRefillFor1MarginLap: Math.max(
      0,
      fuelToFinishRace - fuelLevel + medianFuelPerLap,
    ),
  };
};
