import { z } from 'zod/v4';

const driverSchema = z.object({
  carIdx: z.number(),
  name: z.string(),
  carNumber: z.string(),
  car: z.string(),
  iRating: z.number(),
  license: z.string(),
});

const carSchema = z.object({
  driver: driverSchema,
  position: z.number(),
  lastLapTime: z.number(),
  bestLapTime: z.number(),
  lap: z.number(),
});

export const head2HeadSchema = z.object({
  sessionTime: z.number(),
  player: carSchema,
  ahead: carSchema.nullable(),
  behind: carSchema.nullable(),
});

export type Driver = z.infer<typeof driverSchema>;
export type Car = z.infer<typeof carSchema>;
export type Head2Head = z.infer<typeof head2HeadSchema>;
