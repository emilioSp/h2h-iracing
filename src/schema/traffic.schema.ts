import { z } from 'zod/v4';

export const trafficCarSchema = z.object({
  carIdx: z.number(),
  carNumber: z.string(),
  driverName: z.string(),
  className: z.string(),
  license: z.string(),
  iRating: z.number(),
  gapSeconds: z.number(),
});

export const trafficSchema = z.object({
  cars: z.array(trafficCarSchema),
});

export type TrafficCar = z.infer<typeof trafficCarSchema>;
export type Traffic = z.infer<typeof trafficSchema>;
