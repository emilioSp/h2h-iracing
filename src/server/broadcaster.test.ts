// Verifies SSE client broadcasting during regression tests.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('#dashboard/head2head.dashboard.ts', () => ({
  computeHead2Head: vi.fn<typeof h2hService.computeHead2Head>(),
}));

vi.mock('#server/tick.ts', () => ({
  tick: vi.fn<typeof tickService.tick>(),
  resetInMemoryStorage: vi.fn<typeof tickService.resetInMemoryStorage>(),
}));

vi.mock('#dashboard/weather.dashboard.ts', () => ({
  computeWeather: vi.fn<typeof weatherService.computeWeather>(),
}));

vi.mock('#dashboard/car-telemetry.dashboard.ts', () => ({
  computeCarTelemetry: vi.fn<typeof carService.computeCarTelemetry>(),
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
  type SSEClient,
  stopBroadcasting,
} from '#server/broadcaster.ts';
import * as tickService from '#server/tick.ts';

const createClient = () => ({
  write: vi.fn<SSEClient['write']>().mockResolvedValue(undefined),
  close: vi.fn<SSEClient['close']>(),
});

beforeEach(() => {
  vi.useFakeTimers();
  // JUSTIFICATION: The broadcaster only serializes this partial weather double; it never reads its fields.
  vi.mocked(weatherService.computeWeather).mockResolvedValue({
    airTemp: 20,
  } as never);
  // JUSTIFICATION: The broadcaster only serializes this partial telemetry double; it never reads its fields.
  vi.mocked(carService.computeCarTelemetry).mockResolvedValue({
    abs: 0,
  } as never);
  // JUSTIFICATION: The broadcaster only serializes this partial head-to-head double; it never reads its fields.
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
  it('given connected iRacing when a weather client connects then weather data is sent after the poll interval', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const client = createClient();
    addClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(100);

    expect(client.write).toHaveBeenCalledWith(JSON.stringify({ data: { airTemp: 20 } }));
  });

  it('given connected iRacing when two weather clients connect then weather data is sent to both clients', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const firstClient = createClient();
    const secondClient = createClient();
    addClient({ event: dashboardType.WEATHER, client: firstClient });
    addClient({ event: dashboardType.WEATHER, client: secondClient });

    await vi.advanceTimersByTimeAsync(100);

    expect(firstClient.write).toHaveBeenCalledOnce();
    expect(secondClient.write).toHaveBeenCalledOnce();
  });

  it('given connected iRacing when only a weather client connects then other dashboards are not computed', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const client = createClient();
    addClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherService.computeWeather).toHaveBeenCalledOnce();
    expect(carService.computeCarTelemetry).not.toHaveBeenCalled();
    expect(h2hService.computeHead2Head).not.toHaveBeenCalled();
  });

  it('given polling has stopped when a client connects then polling restarts', async () => {
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
  it('given one connected client when that client disconnects then polling stops', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    const client = createClient();
    addClient({ event: dashboardType.WEATHER, client });
    removeClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherService.computeWeather).not.toHaveBeenCalled();
  });

  it('given two connected clients when one disconnects then polling continues only for the remaining client', async () => {
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
  it('given iRacing returns no head-to-head data when broadcasting runs then the client closes and polling stops', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');
    vi.mocked(h2hService.computeHead2Head).mockResolvedValue(null);
    const client = createClient();
    addClient({ event: dashboardType.H2H, client });

    await vi.advanceTimersByTimeAsync(200);

    expect(client.close).toHaveBeenCalledOnce();
    expect(h2hService.computeHead2Head).toHaveBeenCalledOnce();
  });

  it('given a connected client when iRacing disconnects then polling stops and in-memory state resets', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/disconnected.json');
    const client = createClient();
    addClient({ event: dashboardType.WEATHER, client });

    await vi.advanceTimersByTimeAsync(200);

    expect(weatherService.computeWeather).not.toHaveBeenCalled();
    expect(tickService.resetInMemoryStorage).toHaveBeenCalledOnce();
  });

  it('given two connected clients when one client write fails then that client is removed and healthy clients continue', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/connected.json');

    const failingClient = {
      write: vi.fn<SSEClient['write']>().mockRejectedValue(new Error('stream closed')),
      close: vi.fn<SSEClient['close']>(),
    };

    const healthyClient = createClient();
    addClient({ event: dashboardType.WEATHER, client: failingClient });
    addClient({ event: dashboardType.WEATHER, client: healthyClient });

    await vi.advanceTimersByTimeAsync(200);

    expect(failingClient.write).toHaveBeenCalledOnce();
    expect(healthyClient.write).toHaveBeenCalledTimes(2);
  });

  it('given clients on multiple dashboards when iRacing disconnects then all dashboard clients close', async () => {
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
  it('given registered clients when broadcasting stops then every client closes and in-memory state resets', () => {
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
