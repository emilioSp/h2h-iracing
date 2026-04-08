import { z } from 'zod/v4';

export const carTelemetrySchema = z.object({
  abs: z.number(),
  tc: z.number(),
  isAbsActive: z.boolean(),
  isTcActive: z.boolean(),
  brakeBias: z.number(),
  isPitSpeedLimiterActive: z.boolean(),
});

export type CarTelemetry = z.infer<typeof carTelemetrySchema>;
