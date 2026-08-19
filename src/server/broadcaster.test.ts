import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('#dashboard/head2head.dashboard.ts', () => ({
  computeHead2Head: vi.fn(),
}));
vi.mock('#server/tick.ts', () => ({
  tick: vi.fn(),
  resetInMemoryStorage: vi.fn(),
}));
vi.mock('#dashboard/weather.dashboard.ts', () => ({
  computeWeather: vi.fn(),
}));
vi.mock('#dashboard/car-telemetry.dashboard.ts', () => ({
  computeCarTelemetry: vi.fn(),
}));
vi.mock('#config', () => ({
  default: { POLL_INTERVAL_MS: 100 },
}));

import * as carService from '#dashboard/car-telemetry.dashboard.ts';
import * as h2hService from '#dashboard/head2head.dashboard.ts';
import * as weatherService from '#dashboard/weather.dashboard.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import {
  addClient,
  dashboardType,
  removeClient,
  stopBroadcasting,
} from '#server/broadcaster.ts';
import * as tickService from '#server/tick.ts';

const createClient = () => ({
  write: vi.fn().mockResolvedValue(undefined),
  close: vi.fn(),
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.mocked(weatherService.computeWeather).mockResolvedValue({
    airTemp: 20,
  } as never);
  vi.mocked(carService.computeCarTelemetry).mockResolvedValue({
    abs: 0,
  } as never);
  vi.mocked(h2hService.computeHead2Head).mockResolvedValue({
    player: {},
  } as never);
});

afterEach(() => {
  stopBroadcasting();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('addClient', () => {
  it('When a weather client connects then weather data is sent after the poll interval', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const client = createClient();
    addClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(100);

    expect(client.write).toHaveBeenCalledWith(
      JSON.stringify({ data: { airTemp: 20 } }),
    );
  });

  it('When two weather clients connect then weather data is sent to both clients', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const firstClient = createClient();
    const secondClient = createClient();
    addClient({ event: dashboardType.WEATHER, client: firstClient });
    addClient({ event: dashboardType.WEATHER, client: secondClient });

    await vi.advanceTimersByTimeAsync(100);

    expect(firstClient.write).toHaveBeenCalledOnce();
    expect(secondClient.write).toHaveBeenCalledOnce();
  });

  it('When only a weather client connects then other dashboards are not computed', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const client = createClient();
    addClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherService.computeWeather).toHaveBeenCalledOnce();
    expect(carService.computeCarTelemetry).not.toHaveBeenCalled();
    expect(h2hService.computeHead2Head).not.toHaveBeenCalled();
  });

  it('When a client connects after polling stopped then polling restarts', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const firstClient = createClient();
    addClient({ event: dashboardType.WEATHER, client: firstClient });
    removeClient({ event: dashboardType.WEATHER, client: firstClient });

    const secondClient = createClient();
    addClient({ event: dashboardType.WEATHER, client: secondClient });

    await vi.advanceTimersByTimeAsync(100);

    expect(secondClient.write).toHaveBeenCalledOnce();
  });
});

describe('removeClient', () => {
  it('When the last client disconnects then polling stops', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const client = createClient();
    addClient({ event: dashboardType.WEATHER, client });
    removeClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherService.computeWeather).not.toHaveBeenCalled();
  });

  it('When one of two clients disconnects then polling continues only for the remaining client', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const removedClient = createClient();
    const remainingClient = createClient();
    addClient({ event: dashboardType.WEATHER, client: removedClient });
    addClient({ event: dashboardType.WEATHER, client: remainingClient });

    removeClient({ event: dashboardType.WEATHER, client: removedClient });
    await vi.advanceTimersByTimeAsync(100);

    expect(remainingClient.write).toHaveBeenCalledOnce();
    expect(removedClient.write).not.toHaveBeenCalled();
  });
});

describe('broadcast tick', () => {
  it('When iRacing returns no head-to-head data then the client closes and polling stops', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    vi.mocked(h2hService.computeHead2Head).mockResolvedValue(null);
    const client = createClient();
    addClient({ event: dashboardType.H2H, client });

    await vi.advanceTimersByTimeAsync(200);

    expect(client.close).toHaveBeenCalledOnce();
    expect(h2hService.computeHead2Head).toHaveBeenCalledOnce();
  });

  it('When iRacing disconnects then polling stops and in-memory state resets', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/disconnected.json');
    const client = createClient();
    addClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(200);

    expect(weatherService.computeWeather).not.toHaveBeenCalled();
    expect(tickService.resetInMemoryStorage).toHaveBeenCalledOnce();
  });

  it('When one client write fails then that client is removed and healthy clients continue', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const failingClient = {
      write: vi.fn().mockRejectedValue(new Error('stream closed')),
      close: vi.fn(),
    };
    const healthyClient = createClient();
    addClient({ event: dashboardType.WEATHER, client: failingClient });
    addClient({ event: dashboardType.WEATHER, client: healthyClient });

    await vi.advanceTimersByTimeAsync(200);

    expect(failingClient.write).toHaveBeenCalledOnce();
    expect(healthyClient.write).toHaveBeenCalledTimes(2);
  });

  it('When iRacing disconnects then all dashboard clients close', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/disconnected.json');
    const weatherClient = createClient();
    const carClient = createClient();
    addClient({ event: dashboardType.WEATHER, client: weatherClient });
    addClient({ event: dashboardType.CAR, client: carClient });

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherClient.close).toHaveBeenCalledOnce();
    expect(carClient.close).toHaveBeenCalledOnce();
  });
});

describe('stopBroadcasting', () => {
  it('When broadcasting stops then every registered client closes and in-memory state resets', () => {
    const weatherClient = createClient();
    const h2hClient = createClient();
    addClient({ event: dashboardType.WEATHER, client: weatherClient });
    addClient({ event: dashboardType.H2H, client: h2hClient });

    stopBroadcasting();

    expect(weatherClient.close).toHaveBeenCalledOnce();
    expect(h2hClient.close).toHaveBeenCalledOnce();
    expect(tickService.resetInMemoryStorage).toHaveBeenCalledOnce();
  });
});
