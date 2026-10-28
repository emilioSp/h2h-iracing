// Verifies SSE client broadcasting during regression tests.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('#dashboard/head2head.dashboard.ts', () => ({
  computeHead2Head: vi.fn<typeof h2hService.computeHead2Head>(),
}));

vi.mock('#server/tick.ts', () => ({
  default: {
    tick: vi.fn<typeof tickService.tick>(),
    resetInMemoryStorage: vi.fn<typeof tickService.resetInMemoryStorage>(),
  },
}));

vi.mock('#dashboard/weather.dashboard.ts', () => ({
  computeWeather: vi.fn<typeof weatherService.computeWeather>(),
}));

vi.mock('#dashboard/car-telemetry.dashboard.ts', () => ({
  computeCarTelemetry: vi.fn<typeof carService.computeCarTelemetry>(),
}));

vi.mock('#config', () => ({
  config: { POLL_INTERVAL_MS: 100 },
}));

import { dashboardType } from '#common/constants/dashboard-type.ts';
import * as carService from '#dashboard/car-telemetry.dashboard.ts';
import * as h2hService from '#dashboard/head2head.dashboard.ts';
import * as weatherService from '#dashboard/weather.dashboard.ts';
import { broadcastWeather } from '#fixtures/broadcast-weather.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import broadcaster, { type SSEClient } from '#server/broadcaster.ts';
import tickService from '#server/tick.ts';

const createClient = () => ({
  write: vi.fn<SSEClient['write']>().mockResolvedValue(undefined),
  close: vi.fn<SSEClient['close']>(),
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  broadcaster.stopBroadcasting();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('addClient', () => {
  it('given connected iRacing when a weather client connects then weather data is sent after the poll interval', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/connection/connected.json');
    vi.mocked(weatherService.computeWeather).mockResolvedValue(broadcastWeather);
    const client = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(100);

    expect(client.write).toHaveBeenCalledWith(JSON.stringify({ data: broadcastWeather }));
  });

  it('given connected iRacing when two weather clients connect then weather data is sent to both clients', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/connection/connected.json');
    vi.mocked(weatherService.computeWeather).mockResolvedValue(broadcastWeather);
    const firstClient = createClient();
    const secondClient = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client: firstClient });
    broadcaster.addClient({ event: dashboardType.WEATHER, client: secondClient });

    await vi.advanceTimersByTimeAsync(100);

    expect(firstClient.write).toHaveBeenCalledOnce();
    expect(secondClient.write).toHaveBeenCalledOnce();
  });

  it('given connected iRacing when only a weather client connects then other dashboards are not computed', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/connection/connected.json');
    vi.mocked(weatherService.computeWeather).mockResolvedValue(broadcastWeather);
    const client = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherService.computeWeather).toHaveBeenCalledOnce();
    expect(carService.computeCarTelemetry).not.toHaveBeenCalled();
    expect(h2hService.computeHead2Head).not.toHaveBeenCalled();
  });

  it('given polling has stopped when a client connects then polling restarts', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/connection/connected.json');
    vi.mocked(weatherService.computeWeather).mockResolvedValue(broadcastWeather);
    const firstClient = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client: firstClient });
    broadcaster.removeClient({ event: dashboardType.WEATHER, client: firstClient });

    const secondClient = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client: secondClient });

    await vi.advanceTimersByTimeAsync(100);

    expect(secondClient.write).toHaveBeenCalledOnce();
  });
});

describe('removeClient', () => {
  it('given one connected client when that client disconnects then polling stops', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/connection/connected.json');
    vi.mocked(weatherService.computeWeather).mockResolvedValue(broadcastWeather);
    const client = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client });
    broadcaster.removeClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherService.computeWeather).not.toHaveBeenCalled();
  });

  it('given two connected clients when one disconnects then polling continues only for the remaining client', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/connection/connected.json');
    vi.mocked(weatherService.computeWeather).mockResolvedValue(broadcastWeather);
    const removedClient = createClient();
    const remainingClient = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client: removedClient });
    broadcaster.addClient({ event: dashboardType.WEATHER, client: remainingClient });

    broadcaster.removeClient({ event: dashboardType.WEATHER, client: removedClient });
    await vi.advanceTimersByTimeAsync(100);

    expect(remainingClient.write).toHaveBeenCalledOnce();
    expect(removedClient.write).not.toHaveBeenCalled();
  });
});

describe('broadcast tick', () => {
  it('given a connected client when iRacing disconnects then polling stops and in-memory state resets', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/connection/disconnected.json',
    );
    vi.mocked(weatherService.computeWeather).mockResolvedValue(broadcastWeather);
    const client = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(200);

    expect(weatherService.computeWeather).not.toHaveBeenCalled();
    expect(tickService.resetInMemoryStorage).toHaveBeenCalledOnce();
  });

  it('given two connected clients when one client write fails then that client is removed and healthy clients continue', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/connection/connected.json');
    vi.mocked(weatherService.computeWeather).mockResolvedValue(broadcastWeather);

    const failingClient = {
      write: vi.fn<SSEClient['write']>().mockRejectedValue(new Error('stream closed')),
      close: vi.fn<SSEClient['close']>(),
    };

    const healthyClient = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client: failingClient });
    broadcaster.addClient({ event: dashboardType.WEATHER, client: healthyClient });

    await vi.advanceTimersByTimeAsync(200);

    expect(failingClient.write).toHaveBeenCalledOnce();
    expect(healthyClient.write).toHaveBeenCalledTimes(2);
  });

  it('given clients on multiple dashboards when iRacing disconnects then all dashboard clients close', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/connection/disconnected.json',
    );
    vi.mocked(weatherService.computeWeather).mockResolvedValue(broadcastWeather);
    const weatherClient = createClient();
    const carClient = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client: weatherClient });
    broadcaster.addClient({ event: dashboardType.CAR, client: carClient });

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherClient.close).toHaveBeenCalledOnce();
    expect(carClient.close).toHaveBeenCalledOnce();
  });
});

describe('stopBroadcasting', () => {
  it('given registered clients when broadcasting stops then every client closes and in-memory state resets', () => {
    const weatherClient = createClient();
    const h2hClient = createClient();
    broadcaster.addClient({ event: dashboardType.WEATHER, client: weatherClient });
    broadcaster.addClient({ event: dashboardType.H2H, client: h2hClient });

    broadcaster.stopBroadcasting();

    expect(weatherClient.close).toHaveBeenCalledOnce();
    expect(h2hClient.close).toHaveBeenCalledOnce();
    expect(tickService.resetInMemoryStorage).toHaveBeenCalledOnce();
  });
});
