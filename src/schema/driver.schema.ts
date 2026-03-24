import { z } from 'zod/v4';

export const driverSchema = z.object({
  carIdx: z.number(),
  name: z.string(),
  carNumber: z.string(),
  car: z.string(),
  iRating: z.number(),
  license: z.string(),
  classEstLapTime: z.number(),
});

export type Driver = z.infer<typeof driverSchema>;
