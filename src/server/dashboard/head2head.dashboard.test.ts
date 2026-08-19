import { describe, expect, it } from 'vitest';
import { computeHead2Head } from '#dashboard/head2head.dashboard.ts';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import { refreshCurrentSessionInfo } from '#repository/session-info.repository.ts';
import { resetInMemoryStorage } from '#server/tick.ts';

describe('computeHead2Head', () => {
  it('When iRacing reports a race then the dashboard returns positions, race gaps, and lap deltas', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/head2head/race.json');
    resetInMemoryStorage();
    await refreshDriverInfo();
    await refreshCurrentSessionInfo();

    const head2Head = await computeHead2Head();

    expect(head2Head).toMatchObject({
      sessionTime: 120,
      ahead: { position: 1, driver: { name: 'Ahead' } },
      player: {
        position: 2,
        driver: { name: 'Player', iRating: 3000 },
      },
      behind: { position: 3, driver: { name: 'Behind' } },
      gapAhead: { value: expect.closeTo(18), unit: 'seconds' },
      gapBehind: { value: 18, unit: 'seconds' },
      deltaAhead: 0.5,
      deltaBehind: -1,
    });
  });

  it('When iRacing reports a practice session then the dashboard returns lap deltas without race gaps', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/head2head/practice.json');
    resetInMemoryStorage();
    await refreshDriverInfo();
    await refreshCurrentSessionInfo();

    const head2Head = await computeHead2Head();

    expect(head2Head).toMatchObject({
      gapAhead: null,
      gapBehind: null,
      deltaAhead: 0.5,
      deltaBehind: -1,
    });
  });

  it('When iRacing reports no practice best times then the dashboard returns no lap deltas', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/head2head/practice-missing-best.json',
    );
    resetInMemoryStorage();
    await refreshDriverInfo();
    await refreshCurrentSessionInfo();

    const head2Head = await computeHead2Head();

    expect(head2Head).toMatchObject({
      deltaAhead: null,
      deltaBehind: null,
    });
  });
});
