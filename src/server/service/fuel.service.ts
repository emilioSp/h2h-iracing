// Computes refill amounts for each safety margin when planning fuel to the finish.
import type { FuelRefill } from '#schema/fuel.schema.ts';

type FuelRefillFields = Pick<
  FuelRefill,
  'fuelRefillNoMarginLap' | 'fuelRefillForHalfMarginLap' | 'fuelRefillFor1MarginLap'
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
    fuelRefillForHalfMarginLap: Math.max(0, fuelToFinishRace - fuelLevel + 0.5 * medianFuelPerLap),
    fuelRefillFor1MarginLap: Math.max(0, fuelToFinishRace - fuelLevel + medianFuelPerLap),
  };
};
