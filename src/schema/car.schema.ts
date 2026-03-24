import { z } from 'zod/v4';
import { driverSchema } from '#schema/driver.schema.ts';

export const carSchema = z.object({
  driver: driverSchema,
  position: z.number(),
  lastLapTime: z.number(),
  bestLapTime: z.number(),
  lap: z.number(),
});

export type Car = z.infer<typeof carSchema>;
