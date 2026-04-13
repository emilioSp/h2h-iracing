import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as iracingRepository from '#repository/irsdk.repository.ts';
import { computeHead2Head } from '#service/head2head.service.ts';
import { tick } from '#service/tick.service.ts';

describe('head2head.service (race session - dump)', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await tick();
    vi.spyOn(iracingRepository, 'getSessionType').mockResolvedValue('Race');
  });

  it('returns a valid Head2Head from dump', async () => {
    const head2Head = await computeHead2Head();

    expect(head2Head).not.toBeNull();
    expect(head2Head?.sessionTime).toBeGreaterThan(0);
    expect(head2Head?.player.position).toBeGreaterThan(0);
    expect(head2Head?.player.driver.name).toBeTruthy();
    expect(head2Head?.player.driver.iRating).toBeDefined();
  });

  it('player lap times are positive or NaN', async () => {
    const head2Head = await computeHead2Head();
    const lastLap = head2Head?.player.lastLapTime;
    const bestLap = head2Head?.player.bestLapTime ?? NaN;

    expect(lastLap).toBe(134.90179443359375);
    expect(bestLap).toBe(NaN);
  });

  it('ahead and behind neighbors match expected positions', async () => {
    const head2Head = await computeHead2Head();
    if (!head2Head) return;

    const playerPos = head2Head.player.position;
    if (head2Head.ahead) expect(head2Head.ahead.position).toBe(playerPos - 1);
    if (head2Head.behind) expect(head2Head.behind.position).toBe(playerPos + 1);
  });

  it('gaps are non-null in a race session', async () => {
    const head2Head = await computeHead2Head();
    if (!head2Head) return;

    if (head2Head.ahead) expect(head2Head.gapAhead).not.toBeNull();
    if (head2Head.behind) expect(head2Head.gapBehind).not.toBeNull();
  });
});

describe('head2head.service (non-race session)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('gaps are null during practice/qualify', async () => {
    vi.spyOn(iracingRepository, 'getSessionType').mockResolvedValue('Practice');

    const head2Head = await computeHead2Head();

    expect(head2Head?.gapAhead).toBeNull();
    expect(head2Head?.gapBehind).toBeNull();
  });

  it('delta uses best lap times during qualify', async () => {
    vi.spyOn(iracingRepository, 'getSessionType').mockResolvedValue(
      'Lone Qualify',
    );
    vi.spyOn(iracingRepository, 'getBestLapTime').mockImplementation(
      async (carIdx) => {
        if (carIdx === 4) return 90.0;
        if (carIdx === 3) return 89.5;
        return NaN;
      },
    );
    vi.spyOn(iracingRepository, 'getClassPositions').mockResolvedValue(
      Array(64)
        .fill(0)
        .map((_, i) => i),
    );

    const head2Head = await computeHead2Head();
    if (!head2Head?.ahead) return;

    expect(head2Head.deltaAhead).toBeCloseTo(90.0 - 89.5);
  });

  it('delta is null when a neighbor has no best lap time', async () => {
    vi.spyOn(iracingRepository, 'getSessionType').mockResolvedValue('Practice');
    vi.spyOn(iracingRepository, 'getBestLapTime').mockResolvedValue(NaN);
    vi.spyOn(iracingRepository, 'getClassPositions').mockResolvedValue(
      Array(64)
        .fill(0)
        .map((_, i) => i),
    );

    const head2Head = await computeHead2Head();

    expect(head2Head?.deltaAhead).toBeNull();
    expect(head2Head?.deltaBehind).toBeNull();
  });
});
