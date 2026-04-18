import type { FuelRefill } from '#schema/fuel.schema.ts';

export const getOverallLeaderCarIdx = (positions: number[]): number | null => {
  const idx = positions.indexOf(1);
  return idx === -1 ? null : idx;
};

// NOTE: this function never returns 0. It assumes that when timeRemainingAtLeaderNextSF <= 0, the leader will complete at least one more lap after crossing the SF line, which is a reasonable assumption in most cases.
export const computeEstimatedDurationRaceEnd = (
  timeRemaining: number,
  leaderMedianLapTime: number,
  leaderLapDistPct: number,
): number => {
  const timeToLeaderNextSF = (1 - leaderLapDistPct) * leaderMedianLapTime;
  const timeRemainingAtLeaderNextSF = timeRemaining - timeToLeaderNextSF;

  if (timeRemainingAtLeaderNextSF <= 0) {
    // white flag when the leader crosses the SF line. The next lap is the last
    return timeToLeaderNextSF + leaderMedianLapTime;
  }

  const fullLeaderLapsUntilWhiteFlag = Math.ceil(
    timeRemainingAtLeaderNextSF / leaderMedianLapTime,
  );
  return (
    timeToLeaderNextSF +
    fullLeaderLapsUntilWhiteFlag * leaderMedianLapTime +
    leaderMedianLapTime
  );
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
