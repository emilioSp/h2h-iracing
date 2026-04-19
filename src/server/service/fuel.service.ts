import type { FuelRefill } from '#schema/fuel.schema.ts';

export const getOverallLeaderCarIdx = (positions: number[]): number | null => {
  const idx = positions.indexOf(1);
  return idx === -1 ? null : idx;
};

export const computeEstimatedDurationRaceEnd = (
  timeRemaining: number,
  leaderMedianLapTime: number,
  leaderLapDistPct: number,
): number => {
  const leaderTimeToFinishLap = (1 - leaderLapDistPct) * leaderMedianLapTime;

  return timeRemaining < leaderMedianLapTime
    ? leaderTimeToFinishLap
    : leaderTimeToFinishLap + timeRemaining;
};

type FuelRefillFields = Pick<
  FuelRefill,
  | 'fuelRefillNoMarginLap'
  | 'fuelRefillForHalfMarginLap'
  | 'fuelRefillFor1MarginLap'
>;

export const computeFuelRefill = (
  fuelLevel: number,
  medianFuelPerLap: number | null,
  lapsRemaining: number | null,
): FuelRefillFields => {
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
