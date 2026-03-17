import { describe, expect, it } from 'vitest';
import { computeBattleState } from './battle.service.ts';

describe('battle.service', () => {
  it('returns a valid BattleState from dump', () => {
    const state = computeBattleState();

    expect(state).not.toBeNull();
    expect(state?.sessionTime).toBeGreaterThan(0);
    expect(state?.player.position).toBeGreaterThan(0);
    expect(state?.player.driver.name).toBeTruthy();
    expect(state?.player.driver.iRating).toBeGreaterThan(0);
  });

  it('player lap times are positive or NaN', () => {
    const state = computeBattleState();
    const lastLap = state?.player.lastLapTime ?? NaN;
    const bestLap = state?.player.bestLapTime ?? NaN;

    expect(lastLap > 0 || Number.isNaN(lastLap)).toBe(true);
    expect(bestLap > 0 || Number.isNaN(bestLap)).toBe(true);
  });

  it('deltas are finite or NaN', () => {
    const state = computeBattleState();
    const deltaAhead = state?.deltaAhead ?? NaN;
    const deltaBehind = state?.deltaBehind ?? NaN;

    expect(Number.isFinite(deltaAhead) || Number.isNaN(deltaAhead)).toBe(true);
    expect(Number.isFinite(deltaBehind) || Number.isNaN(deltaBehind)).toBe(
      true,
    );
  });

  it('ahead and behind neighbors match expected positions', () => {
    const state = computeBattleState();
    if (!state) return;

    const playerPos = state.player.position;
    if (state.ahead) expect(state.ahead.position).toBe(playerPos - 1);
    if (state.behind) expect(state.behind.position).toBe(playerPos + 1);
  });
});
