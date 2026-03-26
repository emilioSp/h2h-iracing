import { describe, expect, it } from 'vitest';
import { computeHead2Head } from '#service/head2head.service.ts';

describe('head2head.service', () => {
  it('returns a valid Head2Head from dump', () => {
    const head2Head = computeHead2Head();

    expect(head2Head).not.toBeNull();
    expect(head2Head?.sessionTime).toBeGreaterThan(0);
    expect(head2Head?.player.position).toBeGreaterThan(0);
    expect(head2Head?.player.driver.name).toBeTruthy();
    expect(head2Head?.player.driver.iRating).toBeDefined();
  });

  it('player lap times are positive or NaN', () => {
    const head2Head = computeHead2Head();
    const lastLap = head2Head?.player.lastLapTime;
    const bestLap = head2Head?.player.bestLapTime ?? NaN;

    expect(lastLap).toBe(134.90179443359375);
    expect(bestLap).toBe(NaN);
  });

  it('ahead and behind neighbors match expected positions', () => {
    const head2Head = computeHead2Head();
    if (!head2Head) return;

    const playerPos = head2Head.player.position;
    if (head2Head.ahead) expect(head2Head.ahead.position).toBe(playerPos - 1);
    if (head2Head.behind) expect(head2Head.behind.position).toBe(playerPos + 1);
  });
});
