// Verifies head-to-head dashboard payloads during regression tests.
import { describe, expect, it } from 'vitest';

import { gapUnit } from '#common/constants/gap-unit.ts';
import { computeHead2Head } from '#dashboard/head2head.dashboard.ts';
import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import sessionInfoRepository from '#repository/session-info.repository.ts';
import telemetryTick from '#server/tick.ts';

describe('computeHead2Head', () => {
  it('given iRacing reports a race when the dashboard is computed then the dashboard returns positions, race gaps, and lap deltas', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/head2head/race.json');
    telemetryTick.resetInMemoryStorage();
    await driverRepository.refreshDriverInfo();
    await sessionInfoRepository.refreshCurrentSessionInfo();

    const head2Head = await computeHead2Head();

    expect(head2Head).toMatchObject({
      sessionTime: 120,
      ahead: { position: 1, driver: { name: 'Ahead' } },
      player: {
        position: 2,
        driver: { name: 'Player', iRating: 3000 },
      },
      behind: { position: 3, driver: { name: 'Behind' } },
      gapAhead: { value: expect.closeTo(18), unit: gapUnit.SECONDS },
      gapBehind: { value: 18, unit: gapUnit.SECONDS },
      deltaAhead: 0.5,
      deltaBehind: -1,
    });
  });

  it('given iRacing reports a practice session when the dashboard is computed then the dashboard returns lap deltas without race gaps', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/head2head/practice.json');
    telemetryTick.resetInMemoryStorage();
    await driverRepository.refreshDriverInfo();
    await sessionInfoRepository.refreshCurrentSessionInfo();

    const head2Head = await computeHead2Head();

    expect(head2Head).toMatchObject({
      gapAhead: null,
      gapBehind: null,
      deltaAhead: 0.5,
      deltaBehind: -1,
    });
  });

  it('given iRacing reports no practice best times when the dashboard is computed then the dashboard returns no lap deltas', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/head2head/practice-missing-best.json',
    );
    telemetryTick.resetInMemoryStorage();
    await driverRepository.refreshDriverInfo();
    await sessionInfoRepository.refreshCurrentSessionInfo();

    const head2Head = await computeHead2Head();

    expect(head2Head).toMatchObject({
      deltaAhead: null,
      deltaBehind: null,
    });
  });
});
