import { z } from 'zod/v4';

export const fuelSchema = z.object({
  fuelRefillNoMarginLap: z.number().nullable(),
  fuelRefillForHalfMarginLap: z.number().nullable(),
  fuelRefillFor1MarginLap: z.number().nullable(),
  estimatedTimeRemaining: z.number().nullable(),
  lapsRemaining: z.number().nullable(),
  medianFuelPerLap: z.number().nullable(),
  fuelLastLap: z.number().nullable(),
  fuelLevel: z.number(),
  lastLapNumber: z.number(),
  timeRemaining: z.number().nullable(),
});

export type FuelRefill = z.infer<typeof fuelSchema>;
