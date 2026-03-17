import { z } from 'zod/v4';

const driverInfoSchema = z.object({
  carIdx: z.number(),
  name: z.string(),
  carNumber: z.string(),
  car: z.string(),
  iRating: z.number(),
  license: z.string(),
});

const carStateSchema = z.object({
  driver: driverInfoSchema,
  position: z.number(),
  lastLapTime: z.number(),
  bestLapTime: z.number(),
  lap: z.number(),
});

export const battleStateSchema = z.object({
  sessionTime: z.number(),
  player: carStateSchema,
  ahead: carStateSchema.nullable(),
  behind: carStateSchema.nullable(),
  deltaAhead: z.number(),
  deltaBehind: z.number(),
});

export type DriverInfo = z.infer<typeof driverInfoSchema>;
export type CarState = z.infer<typeof carStateSchema>;
export type BattleState = z.infer<typeof battleStateSchema>;
