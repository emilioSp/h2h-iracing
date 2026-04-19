import type { FuelRefill } from '#schema/fuel.schema.ts';

export const getOverallLeaderCarIdx = (positions: number[]): number | null => {
  const idx = positions.indexOf(1);
  return idx === -1 ? null : idx;
};

// The race ends on the leader's first S/F crossing after the session timer reaches 0. If that moment falls mid-lap, the leader still has to complete the current lap, so we round the remaining laps up to the next integer.
export const computeEstimatedDurationRaceEnd = (
  timeRemaining: number,
  leaderMedianLapTime: number,
  leaderLapDistPct: number,
): number => {
  const timeToLeaderNextSF = (1 - leaderLapDistPct) * leaderMedianLapTime;
  const timeRemainingAtLeaderNextSF = timeRemaining - timeToLeaderNextSF;

  if (timeRemainingAtLeaderNextSF <= 0) {
    return timeToLeaderNextSF;
  }

  const fullLeaderLapsUntilEnd = Math.ceil(
    timeRemainingAtLeaderNextSF / leaderMedianLapTime,
  );
  return timeToLeaderNextSF + fullLeaderLapsUntilEnd * leaderMedianLapTime;
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
