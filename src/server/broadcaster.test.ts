import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('#dashboard/head2head.dashboard.ts', () => ({
  computeHead2Head: vi.fn(),
  cleanUpHead2Head: vi.fn(),
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
vi.mock('#repository/irsdk.repository.ts', () => ({
  isIRacingConnected: vi.fn(),
}));
vi.mock('#config', () => ({
  default: { POLL_INTERVAL_MS: 100 },
}));

import * as carService from '#dashboard/car-telemetry.dashboard.ts';
import * as h2hService from '#dashboard/head2head.dashboard.ts';
import * as weatherService from '#dashboard/weather.dashboard.ts';
import * as iracingRepo from '#repository/irsdk.repository.ts';
import {
  addClient,
  dashboardType,
  removeClient,
  stopBroadcasting,
} from '#server/broadcaster.ts';
import * as tickService from '#server/tick.ts';

const mockClient = () => ({
  write: vi.fn().mockResolvedValue(undefined),
  close: vi.fn(),
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.mocked(iracingRepo.isIRacingConnected).mockResolvedValue(true);
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
  it('sends data to client after poll interval', async () => {
    const client = mockClient();
    addClient(dashboardType.WEATHER, client);

    await vi.advanceTimersByTimeAsync(100);

    expect(client.write).toHaveBeenCalledWith(
      JSON.stringify({ data: { airTemp: 20 } }),
    );
  });

  it('broadcasts to all clients of the same event type', async () => {
    const client1 = mockClient();
    const client2 = mockClient();
    addClient(dashboardType.WEATHER, client1);
    addClient(dashboardType.WEATHER, client2);

    await vi.advanceTimersByTimeAsync(100);

    expect(client1.write).toHaveBeenCalledOnce();
    expect(client2.write).toHaveBeenCalledOnce();
  });

  it('only calls compute for events with registered clients', async () => {
    const client = mockClient();
    addClient(dashboardType.WEATHER, client);

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherService.computeWeather).toHaveBeenCalledOnce();
    expect(carService.computeCarTelemetry).not.toHaveBeenCalled();
    expect(h2hService.computeHead2Head).not.toHaveBeenCalled();
  });

  it('restarts the poller when a client is added after the poller stopped', async () => {
    const client1 = mockClient();
    addClient(dashboardType.WEATHER, client1);
    removeClient(dashboardType.WEATHER, client1);

    const client2 = mockClient();
    addClient(dashboardType.WEATHER, client2);

    await vi.advanceTimersByTimeAsync(100);

    expect(client2.write).toHaveBeenCalledOnce();
  });
});

describe('removeClient', () => {
  it('stops the poller when the last client disconnects', async () => {
    const client = mockClient();
    addClient(dashboardType.WEATHER, client);
    removeClient(dashboardType.WEATHER, client);

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherService.computeWeather).not.toHaveBeenCalled();
  });

  it('keeps polling when other clients remain after removal', async () => {
    const client1 = mockClient();
    const client2 = mockClient();
    addClient(dashboardType.WEATHER, client1);
    addClient(dashboardType.WEATHER, client2);

    removeClient(dashboardType.WEATHER, client1);
    await vi.advanceTimersByTimeAsync(100);

    expect(client2.write).toHaveBeenCalledOnce();
    expect(client1.write).not.toHaveBeenCalled();
  });
});

describe('broadcast tick', () => {
  it('stops polling and calls h2h cleanup when computeHead2Head returns null', async () => {
    vi.mocked(h2hService.computeHead2Head).mockResolvedValue(null);
    const client = mockClient();
    addClient(dashboardType.H2H, client);

    await vi.advanceTimersByTimeAsync(100);

    expect(client.write).not.toHaveBeenCalled();
  });

  it('stops polling when iRacing disconnects', async () => {
    vi.mocked(iracingRepo.isIRacingConnected).mockResolvedValue(false);
    const client = mockClient();
    addClient(dashboardType.WEATHER, client);

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherService.computeWeather).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(100);
    expect(weatherService.computeWeather).not.toHaveBeenCalled();

    expect(tickService.resetInMemoryStorage).toHaveBeenCalledOnce();
  });

  it('removes client and continues broadcasting when a write fails', async () => {
    const failingClient = {
      write: vi.fn().mockRejectedValue(new Error('stream closed')),
      close: vi.fn(),
    };
    const healthyClient = mockClient();
    addClient(dashboardType.WEATHER, failingClient);
    addClient(dashboardType.WEATHER, healthyClient);

    await vi.advanceTimersByTimeAsync(100);

    expect(failingClient.write).toHaveBeenCalledOnce();

    await vi.advanceTimersByTimeAsync(100);

    expect(failingClient.write).toHaveBeenCalledOnce();
    expect(healthyClient.write).toHaveBeenCalledTimes(2);
  });

  it('calls close on all clients when iRacing disconnects', async () => {
    vi.mocked(iracingRepo.isIRacingConnected).mockResolvedValue(false);
    const weatherClient = mockClient();
    const carClient = mockClient();
    addClient(dashboardType.WEATHER, weatherClient);
    addClient(dashboardType.CAR, carClient);

    await vi.advanceTimersByTimeAsync(100);

    expect(weatherClient.close).toHaveBeenCalledOnce();
    expect(carClient.close).toHaveBeenCalledOnce();
  });

  it('calls close on h2h clients when computeHead2Head returns null', async () => {
    vi.mocked(h2hService.computeHead2Head).mockResolvedValue(null);
    const client = mockClient();
    addClient(dashboardType.H2H, client);

    await vi.advanceTimersByTimeAsync(100);

    expect(client.close).toHaveBeenCalledOnce();
  });
});

describe('stopPoller', () => {
  it('calls close on all registered clients', () => {
    const weatherClient = mockClient();
    const h2hClient = mockClient();
    addClient(dashboardType.WEATHER, weatherClient);
    addClient(dashboardType.H2H, h2hClient);

    stopBroadcasting();

    expect(weatherClient.close).toHaveBeenCalledOnce();
    expect(h2hClient.close).toHaveBeenCalledOnce();
    expect(tickService.resetInMemoryStorage).toHaveBeenCalledOnce();
  });
});
