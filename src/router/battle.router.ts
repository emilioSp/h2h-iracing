import type { Context } from 'hono';
import { computeHead2Head } from '#service/head2head.service.ts';

export const battleStateRouter = (c: Context) => {
  const state = computeHead2Head();

  if (!state) {
    return c.json(
      { error: { code: 'NO_SESSION', message: 'No active race session' } },
      503,
    );
  }

  return c.json({ data: state });
};
