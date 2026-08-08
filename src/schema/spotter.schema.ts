import { z } from 'zod/v4';

export const carLeftRight = {
  OFF: 0,
  CLEAR: 1,
  CAR_LEFT: 2,
  CAR_RIGHT: 3,
  CAR_LEFT_AND_RIGHT: 4,
  TWO_CARS_LEFT: 5,
  TWO_CARS_RIGHT: 6,
} as const;

export const spotterSideSchema = z.object({
  overlapStartPct: z.number(),
  overlapEndPct: z.number(),
});

export const spotterSchema = z.object({
  left: spotterSideSchema.nullable(),
  right: spotterSideSchema.nullable(),
  isThreeWide: z.boolean(),
});

export type SpotterSide = z.infer<typeof spotterSideSchema>;
export type Spotter = z.infer<typeof spotterSchema>;
