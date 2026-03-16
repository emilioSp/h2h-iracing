import type { Context } from 'hono';
import { computeBattleState } from '#service/battle.service.ts';

export const battleStateRouter = (c: Context) => {
  const state = computeBattleState();

  if (!state) {
    return c.json(
      { error: { code: 'NO_SESSION', message: 'No active race session' } },
      503,
    );
  }

  return c.json({ data: state });
};
