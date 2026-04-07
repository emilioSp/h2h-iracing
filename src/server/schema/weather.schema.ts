import { z } from 'zod/v4';

export const weatherSchema = z.object({
  airTemperatureC: z.number(),
  trackTemperatureC: z.number(),
  relativeHumidityPct: z.number(),
  precipitationPct: z.number(),
  trackWetness: z.string(),
  windDirectionRad: z.number(),
  windVelocityMs: z.number(),
});

export type Weather = z.infer<typeof weatherSchema>;
