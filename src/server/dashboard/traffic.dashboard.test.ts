// Verifies traffic dashboard payloads during regression tests.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionType } from '#common/constants/session-type.ts';
import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import referenceLapRepository from '#repository/reference-lap.repository.ts';
import { computeTraffic } from '#server/dashboard/traffic.dashboard.ts';

beforeEach(() => {
  referenceLapRepository.resetReferenceLaps();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('computeTraffic', () => {
  it('given iRacing reports a faster-class car behind in Open Qualify when the dashboard is computed then the dashboard returns that car', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/traffic/faster-and-same-class-behind.json',
    );
    await driverRepository.refreshDriverInfo();

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
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/traffic/faster-and-same-class-behind.json',
    );
    await driverRepository.refreshDriverInfo();

    const traffic = await computeTraffic();

    expect(traffic.cars.map((car) => car.carIdx)).not.toContain(2);
  });

  it('given iRacing reports the player in pit road when the dashboard is computed then the dashboard returns no traffic', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/traffic/player-in-pit.json',
    );

    expect(await computeTraffic()).toEqual({ cars: [] });
  });

  it('given iRacing reports faster traffic in Lone Qualify when the dashboard is computed then it returns no cars', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/traffic/faster-and-same-class-behind.json',
    );
    await driverRepository.refreshDriverInfo();
    const session = (await irsdkRepository.getCurrentSessionInfo())!;
    vi.spyOn(irsdkRepository, 'getCurrentSessionInfo').mockResolvedValue({
      ...session,
      SessionType: sessionType.LONE_QUALIFY,
    });

    expect(await computeTraffic()).toEqual({ cars: [] });
  });

  it('given faster traffic in Open Qualify when Lone Qualify begins without results then the dashboard returns no cars', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/traffic/faster-and-same-class-behind.json',
    );
    await driverRepository.refreshDriverInfo();
    const session = (await irsdkRepository.getCurrentSessionInfo())!;
    expect((await computeTraffic()).cars).toEqual([expect.objectContaining({ carIdx: 1 })]);

    vi.spyOn(irsdkRepository, 'getCurrentSessionInfo').mockResolvedValue({
      ...session,
      SessionType: sessionType.LONE_QUALIFY,
      ResultsPositions: null,
    });

    expect(await computeTraffic()).toEqual({ cars: [] });
  });

  it('given faster traffic in Open Qualify when only the session changes to Lone Qualify then the dashboard returns no cars', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/traffic/faster-and-same-class-behind.json',
    );
    await driverRepository.refreshDriverInfo();
    const session = (await irsdkRepository.getCurrentSessionInfo())!;
    expect((await computeTraffic()).cars).toEqual([expect.objectContaining({ carIdx: 1 })]);

    vi.spyOn(irsdkRepository, 'getCurrentSessionInfo').mockResolvedValue({
      ...session,
      SessionType: sessionType.LONE_QUALIFY,
    });

    expect(await computeTraffic()).toEqual({ cars: [] });
  });

  it('given faster traffic is suppressed in Lone Qualify when the session changes to Open Qualify then the dashboard returns the LMP2', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/traffic/faster-and-same-class-behind.json',
    );
    await driverRepository.refreshDriverInfo();
    const session = (await irsdkRepository.getCurrentSessionInfo())!;

    const currentSession = vi.spyOn(irsdkRepository, 'getCurrentSessionInfo').mockResolvedValue({
      ...session,
      SessionType: sessionType.LONE_QUALIFY,
    });

    expect(await computeTraffic()).toEqual({ cars: [] });

    currentSession.mockResolvedValue(session);

    expect((await computeTraffic()).cars).toEqual([
      expect.objectContaining({ carIdx: 1, className: 'LMP2' }),
    ]);
  });
});
