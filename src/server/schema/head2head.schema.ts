import { z } from 'zod/v4';
import { carSchema } from '#schema/car.schema.ts';

const gapSchema = z.object({
  value: z.number(),
  unit: z.enum(['seconds', 'laps']),
  method: z.enum(['est', 'ref', 'lap']),
});

export const head2HeadSchema = z.object({
  sessionTime: z.number(),
  player: carSchema,
  ahead: carSchema.nullable(),
  behind: carSchema.nullable(),
  gapAhead: gapSchema.nullable(),
  gapBehind: gapSchema.nullable(),
  deltaAhead: z.number(),
  deltaBehind: z.number(),
});

export type Head2Head = z.infer<typeof head2HeadSchema>;
