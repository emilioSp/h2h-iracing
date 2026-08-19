import { beforeEach, describe, expect, it } from 'vitest';
import { computeHead2Head } from '#dashboard/head2head.dashboard.ts';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import { refreshCurrentSessionInfo } from '#repository/session-info.repository.ts';
import { resetInMemoryStorage } from '#server/tick.ts';

const loadHead2HeadFixture = async (path: string): Promise<void> => {
  loadTelemetryFixture(path);
  resetInMemoryStorage();
  await refreshDriverInfo();
  await refreshCurrentSessionInfo();
};

describe('computeHead2Head in a race', () => {
  beforeEach(async () => {
    await loadHead2HeadFixture('fixture/telemetry-mock/head2head/race.json');
  });

  it('returns a valid result', async () => {
    const head2Head = await computeHead2Head();

    expect(head2Head).not.toBeNull();
    expect(head2Head?.sessionTime).toBe(120);
    expect(head2Head?.player.position).toBe(2);
    expect(head2Head?.player.driver.name).toBe('Player');
    expect(head2Head?.player.driver.iRating).toBe(3000);
  });

  it('returns the cars ahead and behind', async () => {
    const head2Head = await computeHead2Head();

    expect(head2Head?.ahead?.position).toBe(1);
    expect(head2Head?.player.position).toBe(2);
    expect(head2Head?.behind?.position).toBe(3);
  });

  it('returns race gaps', async () => {
    const head2Head = await computeHead2Head();

    expect(head2Head?.gapAhead).not.toBeNull();
    expect(head2Head?.gapBehind).not.toBeNull();
  });
});

describe('computeHead2Head in a practise', () => {
  it('returns null gaps', async () => {
    await loadHead2HeadFixture(
      'fixture/telemetry-mock/head2head/practice.json',
    );

    const head2Head = await computeHead2Head();

    expect(head2Head?.gapAhead).toBeNull();
    expect(head2Head?.gapBehind).toBeNull();
  });

  it('uses best lap times for the delta', async () => {
    await loadHead2HeadFixture(
      'fixture/telemetry-mock/head2head/practice.json',
    );

    const head2Head = await computeHead2Head();

    expect(head2Head?.deltaAhead).toBeCloseTo(90 - 89.5);
  });

  it('returns null deltas when a neighbor has no best lap time', async () => {
    await loadHead2HeadFixture(
      'fixture/telemetry-mock/head2head/practice-missing-best.json',
    );

    const head2Head = await computeHead2Head();

    expect(head2Head?.deltaAhead).toBeNull();
    expect(head2Head?.deltaBehind).toBeNull();
  });
});
