import { z } from 'zod/v4';

export const weatherSchema = z.object({
  airTemperatureC: z.number(),
  trackTemperatureC: z.number(),
  relativeHumidityPct: z.number(),
  precipitationPct: z.number(),
  trackWetness: z.string(),
  windDirectionRad: z.number(),
  windDirectionDeg: z.number(),
  windRelativeDirectionRad: z.number(),
  windRelativeDirectionDeg: z.number(),
  windVelocityMs: z.number(),
  yawNorthDirectionRad: z.number(),
  yawNorthDirectionDeg: z.number(),
  sessionSecondsAfterMidnight: z.number(),
});

export type Weather = z.infer<typeof weatherSchema>;
