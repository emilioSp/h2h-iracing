import { z } from 'zod/v4';

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
