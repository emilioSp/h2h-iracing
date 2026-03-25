import type { Context } from 'hono';
import { computeHead2Head } from '#service/head2head.service.ts';

export const h2hRouter = (c: Context) => {
  const h2h = computeHead2Head();

  if (!h2h) {
    return c.json(
      { error: { code: 'NO_SESSION', message: 'No active race session' } },
      503,
    );
  }

  return c.json({ data: h2h });
};
