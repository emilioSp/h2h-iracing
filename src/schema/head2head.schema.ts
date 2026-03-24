import { z } from 'zod/v4';
import { carSchema } from '#schema/car.schema.ts';

export const head2HeadSchema = z.object({
  sessionTime: z.number(),
  player: carSchema,
  ahead: carSchema.nullable(),
  behind: carSchema.nullable(),
  gapAhead: z.number(),
  gapBehind: z.number(),
  deltaAhead: z.number(),
  deltaBehind: z.number(),
  bestRefLapTime: z.number(),
});

export type Head2Head = z.infer<typeof head2HeadSchema>;
