// Exercises real dashboard computations, connection rejection, and tracking cleanup through broadcasting.
import { VARS } from '@emiliosp/node-iracing-sdk';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { dashboardType } from '#common/constants/dashboard-type.ts';
import { computeCarTelemetry } from '#dashboard/car-telemetry.dashboard.ts';
import { computeFuel } from '#dashboard/fuel.dashboard.ts';
import { computeHead2Head } from '#dashboard/head2head.dashboard.ts';
import { computeSpotter } from '#dashboard/spotter.dashboard.ts';
import { computeTraffic } from '#dashboard/traffic.dashboard.ts';
import { computeWeather } from '#dashboard/weather.dashboard.ts';
import fuelRepository from '#repository/fuel.repository.ts';
import { IRSDKMock } from '#repository/irsdk-mock.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import lapRepository from '#repository/lap.repository.ts';
import referenceLapRepository from '#repository/reference-lap.repository.ts';
import broadcaster, { type SSEClient } from '#server/broadcaster.ts';

vi.mock('#config', () => ({ config: { POLL_INTERVAL_MS: 100 } }));

afterEach(() => {
  broadcaster.stopBroadcasting();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('repository availability through broadcasting', () => {
  it('given a usable player with one fuel sample and no neighbouring cars when all dashboards are subscribed then every stream sends its normal computed payload', async () => {
    vi.useFakeTimers();
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/fuel/one-lap-sample.json');

    const clients = Object.values(dashboardType).map((event) => ({
      event,
      client: { write: vi.fn<SSEClient['write']>(), close: vi.fn<SSEClient['close']>() },
    }));

    for (const subscription of clients) broadcaster.addClient(subscription);

    await vi.advanceTimersByTimeAsync(100);

    const expected = {
      [dashboardType.H2H]: await computeHead2Head(),
      [dashboardType.WEATHER]: await computeWeather(),
      [dashboardType.CAR]: await computeCarTelemetry(),
      [dashboardType.FUEL]: await computeFuel(),
      [dashboardType.SPOTTER]: await computeSpotter(),
      [dashboardType.TRAFFIC]: await computeTraffic(),
    };

    for (const { event, client } of clients) {
      expect(client.write).toHaveBeenCalledExactlyOnceWith(
        JSON.stringify({ data: expected[event] }),
      );
      expect(client.close).not.toHaveBeenCalled();
    }

    expect(expected[dashboardType.SPOTTER]).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
    expect(expected[dashboardType.TRAFFIC]).toEqual({ cars: [] });
    expect(expected[dashboardType.FUEL]).toMatchObject({
      fuelLevel: 50,
      timeRemaining: 600,
      medianFuelPerLap: null,
    });
  });

  it('given a connected SDK without a player and with stale weather when all dashboards are subscribed then every stream closes without publishing any payload', async () => {
    vi.useFakeTimers();
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/connection/negative-player.json',
    );

    const clients = Object.values(dashboardType).map((event) => ({
      event,
      client: { write: vi.fn<SSEClient['write']>(), close: vi.fn<SSEClient['close']>() },
    }));

    for (const subscription of clients) broadcaster.addClient(subscription);

    await vi.advanceTimersByTimeAsync(300);

    for (const { client } of clients) {
      expect(client.write).not.toHaveBeenCalled();
      expect(client.close).toHaveBeenCalledOnce();
    }

    expect(vi.getTimerCount()).toBe(0);
  });

  it('given all streams have sent data and fuel, lap-time, and reference histories exist when the connected SDK loses its player then all original streams close without more data and histories are cleared', async () => {
    vi.useFakeTimers();
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/fuel/one-lap-sample.json');

    const clients = Object.values(dashboardType).map((event) => ({
      event,
      client: { write: vi.fn<SSEClient['write']>(), close: vi.fn<SSEClient['close']>() },
    }));

    for (const subscription of clients) broadcaster.addClient(subscription);
    await vi.advanceTimersByTimeAsync(100);

    for (const { client } of clients) expect(client.write).toHaveBeenCalledOnce();

    // The first broadcast recorded lap 0 at 50 L and its 90-second lap time.
    fuelRepository.updateFuelTracking({ fuelLevel: 48, playerLapCompleted: 1 });
    lapRepository.updateLapTimeTracking({ carsIdx: [0], lapsCompleted: [1], lastLapTimes: [92] });

    const referenceLap = {
      startTime: 0,
      finishTime: 90,
      lastTrackedPct: 0.99,
      isOnPitRoad: false,
      refPoints: new Map([[0, { trackPct: 0, timeElapsedSinceStart: 0 }]]),
    };

    referenceLapRepository.setActiveRefLap({ carIdx: 0, lap: referenceLap });
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: referenceLap });
    expect(fuelRepository.getFuelSamples()).toEqual([
      { lapNumber: 0, fuelAtLapStart: 50 },
      { lapNumber: 1, fuelAtLapStart: 48 },
    ]);
    expect(lapRepository.getMedianLapTime(0)).toBe(91);
    expect(referenceLapRepository.getActiveRefLap(0)).not.toBeNull();
    expect(referenceLapRepository.getRefLap(0)).not.toBeNull();

    const get = IRSDKMock.prototype.get;
    vi.spyOn(IRSDKMock.prototype, 'get').mockImplementation(function (this: IRSDKMock, key) {
      return key === VARS.PLAYER_CAR_IDX ? [-1] : get.call(this, key);
    });
    await vi.advanceTimersByTimeAsync(300);

    for (const { client } of clients) {
      expect(client.close).toHaveBeenCalledOnce();
      expect(client.write).toHaveBeenCalledOnce();
    }

    expect(fuelRepository.getFuelSamples()).toEqual([]);
    expect(lapRepository.getMedianLapTime(0)).toBeNull();
    expect(referenceLapRepository.getActiveRefLap(0)).toBeNull();
    expect(referenceLapRepository.getRefLap(0)).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('given a usable connected SDK when refreshing telemetry reveals player loss then every stream closes before any dashboard payload is published', async () => {
    vi.useFakeTimers();
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/fuel/one-lap-sample.json');

    const clients = Object.values(dashboardType).map((event) => ({
      event,
      client: { write: vi.fn<SSEClient['write']>(), close: vi.fn<SSEClient['close']>() },
    }));

    for (const subscription of clients) broadcaster.addClient(subscription);
    vi.spyOn(IRSDKMock.prototype, 'refreshSharedMemory').mockImplementation(() => {
      const get = IRSDKMock.prototype.get;
      vi.spyOn(IRSDKMock.prototype, 'get').mockImplementation(function (this: IRSDKMock, key) {
        return key === VARS.PLAYER_CAR_IDX ? [-1] : get.call(this, key);
      });
    });

    await vi.advanceTimersByTimeAsync(100);

    for (const { client } of clients) {
      expect(client.write).not.toHaveBeenCalled();
      expect(client.close).toHaveBeenCalledOnce();
    }
  });
});
