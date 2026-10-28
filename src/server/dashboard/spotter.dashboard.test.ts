// Verifies spotter dashboard payloads during regression tests.
import { describe, expect, it } from 'vitest';

import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import { computeSpotter } from '#server/dashboard/spotter.dashboard.ts';

describe('computeSpotter', () => {
  it('given iRacing reports a clear track when the dashboard is computed then both bars are empty', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/spotter/clear.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
  });

  it('given iRacing reports the spotter is off when the dashboard is computed then both bars are empty', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/spotter/off.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
  });

  it('given iRacing reports a car on the left when the dashboard is computed then only the left bar shows its overlap', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/spotter/left.json');
    await driverRepository.refreshDriverInfo();

    const spotter = await computeSpotter();

    expect(spotter).toEqual({
      left: {
        overlapStartPct: expect.closeTo(100 / 4.8, 5),
        overlapEndPct: 100,
      },
      right: null,
      isThreeWide: false,
    });
  });

  it('given iRacing reports a car on the right when the dashboard is computed then only the right bar shows an overlap', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/spotter/right.json');
    await driverRepository.refreshDriverInfo();

    const spotter = await computeSpotter();

    expect(spotter.left).toBeNull();
    expect(spotter.right).not.toBeNull();
  });

  it('given iRacing reports two cars on the left when the dashboard is computed then the dashboard reports three wide', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/spotter/two-left.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: true,
    });
  });

  it('given iRacing reports two cars on the right when the dashboard is computed then the dashboard reports three wide', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/spotter/two-right.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: true,
    });
  });

  it('given iRacing reports cars on both sides when the dashboard is computed then the dashboard reports three wide', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/spotter/three-wide.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: true,
    });
  });

  it('given iRacing reports a car on the left but no overlap when the dashboard is computed then the left bar has no coloured segment', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/spotter/no-overlap.json');
    await driverRepository.refreshDriverInfo();

    const spotter = await computeSpotter();

    // Equal start and end values produce a visible bar with no coloured segment.
    expect(spotter.left).toEqual({ overlapStartPct: 100, overlapEndPct: 100 });
  });
});
