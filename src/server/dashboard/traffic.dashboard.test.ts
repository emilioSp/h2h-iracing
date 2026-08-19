import { beforeEach, describe, expect, it } from 'vitest';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import { resetReferenceLaps } from '#repository/reference-lap.repository.ts';
import { computeTraffic } from '#server/dashboard/traffic.dashboard.ts';

beforeEach(() => {
  resetReferenceLaps();
});

describe('computeTraffic', () => {
  it('reports the faster car and skips the same-class car', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/traffic/default.json');
    await refreshDriverInfo();

    const traffic = await computeTraffic();

    expect(traffic.cars).toHaveLength(1);
    expect(traffic.cars[0]).toMatchObject({
      carIdx: 1,
      carNumber: '6',
      driverName: 'Aussie Greg Hill',
      className: 'LMP2',
      license: 'B 2.10',
      iRating: 4200,
    });
  });

  it('reports nothing when the player is in pit road', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/traffic/player-in-pit.json');

    expect(await computeTraffic()).toEqual({ cars: [] });
  });
});
