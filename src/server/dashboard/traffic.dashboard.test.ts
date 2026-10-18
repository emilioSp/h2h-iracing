// Verifies traffic dashboard payloads during regression tests.
import { beforeEach, describe, expect, it } from 'vitest';

import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import { resetReferenceLaps } from '#repository/reference-lap.repository.ts';
import { computeTraffic } from '#server/dashboard/traffic.dashboard.ts';

beforeEach(() => {
  resetReferenceLaps();
});

describe('computeTraffic', () => {
  it('given iRacing reports a faster-class car behind when the dashboard is computed then the dashboard returns that car', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/traffic/faster-and-same-class-behind.json');
    await refreshDriverInfo();

    const traffic = await computeTraffic();

    expect(traffic.cars).toEqual([
      expect.objectContaining({
        carIdx: 1,
        carNumber: '6',
        driverName: 'Aussie Greg Hill',
        className: 'LMP2',
        license: 'B 2.10',
        iRating: 4200,
      }),
    ]);
  });

  it('given iRacing reports a same-class car behind when the dashboard is computed then the dashboard excludes that car', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/traffic/faster-and-same-class-behind.json');
    await refreshDriverInfo();

    const traffic = await computeTraffic();

    expect(traffic.cars.map((car) => car.carIdx)).not.toContain(2);
  });

  it('given iRacing reports the player in pit road when the dashboard is computed then the dashboard returns no traffic', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/traffic/player-in-pit.json');

    expect(await computeTraffic()).toEqual({ cars: [] });
  });
});
