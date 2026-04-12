import config from '#config';
import { isIRacingConnected } from '#repository/irsdk.repository.ts';
import { computeCarTelemetry } from '#service/car-telemetry.service.ts';
import {
  computeHead2Head,
  resetSessionNumber,
} from '#service/head2head.service.ts';
import { resetReferenceLaps } from '#service/reference-lap.service.ts';
import { computeWeather } from '#service/weather.service.ts';

export const dashboardType = {
  H2H: 'H2H',
  WEATHER: 'WEATHER',
  CAR: 'CAR',
} as const;

export type DashboardType = keyof typeof dashboardType;

export type SSEClient = {
  write: (data: string) => Promise<void>;
  close: () => void | Promise<void>;
};

const clients: Map<DashboardType, Set<SSEClient>> = new Map([
  [dashboardType.H2H, new Set()],
  [dashboardType.WEATHER, new Set()],
  [dashboardType.CAR, new Set()],
]);

let timer: ReturnType<typeof setTimeout> | null = null;

const cleanupH2h = () => {
  resetReferenceLaps();
  resetSessionNumber();
};

const closeSSEStream = (set: Set<SSEClient>) => {
  for (const client of set) {
    client.close();
  }
  set.clear();
};

const writeToClients = async (
  clientSet: Set<SSEClient>,
  data: unknown,
): Promise<void> => {
  const json = JSON.stringify({ data });
  await Promise.all(
    [...clientSet].map(async (client) => {
      try {
        await client.write(json);
      } catch {
        clientSet.delete(client);
      }
    }),
  );
};

const broadcastH2H = async () => {
  const h2hClients = clients.get(dashboardType.H2H)!;
  if (h2hClients.size > 0) {
    const result = await computeHead2Head();
    if (result === null) {
      closeSSEStream(h2hClients);
      cleanupH2h();
    } else {
      await writeToClients(h2hClients, result);
    }
  }
};

const broadcastWeather = async () => {
  const weatherClients = clients.get(dashboardType.WEATHER)!;
  if (weatherClients.size > 0) {
    await writeToClients(weatherClients, await computeWeather());
  }
};

const broadcastCar = async () => {
  const carClients = clients.get(dashboardType.CAR)!;
  if (carClients.size > 0) {
    await writeToClients(carClients, await computeCarTelemetry());
  }
};

const broadcast = async (): Promise<void> => {
  if (!(await isIRacingConnected())) {
    stopBroadcasting();
    return;
  }

  await Promise.all([broadcastH2H(), broadcastWeather(), broadcastCar()]);

  if (
    clients.get(dashboardType.H2H)?.size === 0 &&
    clients.get(dashboardType.WEATHER)?.size === 0 &&
    clients.get(dashboardType.CAR)?.size === 0
  ) {
    stopBroadcasting();
    return;
  }

  timer = setTimeout(broadcast, config.POLL_INTERVAL_MS);
};

const startBroadcasting = () => {
  if (timer !== null) return;
  timer = setTimeout(broadcast, config.POLL_INTERVAL_MS);
};

export const stopBroadcasting = () => {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  const h2hSet = clients.get(dashboardType.H2H)!;
  if (h2hSet.size > 0) cleanupH2h();
  for (const set of clients.values()) {
    closeSSEStream(set);
  }
};

export const addClient = (event: DashboardType, client: SSEClient) => {
  clients.get(event)?.add(client);
  startBroadcasting();
};

export const removeClient = (event: DashboardType, client: SSEClient) => {
  const clientSet = clients.get(event) ?? new Set<SSEClient>();
  clientSet.delete(client);

  // TODO: add a common interface to always call cleanup method for each dashboard (noop if not needed)
  if (event === dashboardType.H2H && clientSet.size === 0) {
    cleanupH2h();
  }
};
