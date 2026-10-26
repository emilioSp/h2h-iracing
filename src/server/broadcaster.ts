// Sends dashboard updates to subscribed SSE clients while polling iRacing.
import config from '#config';
import { computeCarTelemetry } from '#dashboard/car-telemetry.dashboard.ts';
import { computeFuel } from '#dashboard/fuel.dashboard.ts';
import { computeHead2Head } from '#dashboard/head2head.dashboard.ts';
import { computeSpotter } from '#dashboard/spotter.dashboard.ts';
import { computeTraffic } from '#dashboard/traffic.dashboard.ts';
import { computeWeather } from '#dashboard/weather.dashboard.ts';
import { isIRacingConnected } from '#repository/irsdk.repository.ts';
import { resetInMemoryStorage, tick } from '#server/tick.ts';

export const dashboardType = {
  H2H: 'H2H',
  WEATHER: 'WEATHER',
  CAR: 'CAR',
  FUEL: 'FUEL',
  SPOTTER: 'SPOTTER',
  TRAFFIC: 'TRAFFIC',
} as const;

export type DashboardType = keyof typeof dashboardType;

const dashboardComputations = {
  [dashboardType.H2H]: computeHead2Head,
  [dashboardType.WEATHER]: computeWeather,
  [dashboardType.CAR]: computeCarTelemetry,
  [dashboardType.FUEL]: computeFuel,
  [dashboardType.SPOTTER]: computeSpotter,
  [dashboardType.TRAFFIC]: computeTraffic,
};

export type SSEClient = {
  write: (data: string) => Promise<void>;
  close: () => void | Promise<void>;
};

const clients: Map<DashboardType, Set<SSEClient>> = new Map([
  [dashboardType.H2H, new Set()],
  [dashboardType.WEATHER, new Set()],
  [dashboardType.CAR, new Set()],
  [dashboardType.FUEL, new Set()],
  [dashboardType.SPOTTER, new Set()],
  [dashboardType.TRAFFIC, new Set()],
]);

let timer: ReturnType<typeof setTimeout> | null = null;

const closeSSEStream = (set: Set<SSEClient>) => {
  for (const client of set) {
    client.close();
  }

  set.clear();
};

type WriteToClientsInput = {
  clientSet: Set<SSEClient>;
  data: unknown;
};

const writeToClients = async ({ clientSet, data }: WriteToClientsInput): Promise<void> => {
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

const broadcastDashboard = async (event: DashboardType): Promise<void> => {
  const clientSet = clients.get(event);

  if (!clientSet || clientSet.size === 0) return;

  const data = await dashboardComputations[event]();

  await writeToClients({ clientSet, data });
};

const broadcast = async (): Promise<void> => {
  await tick();

  if (!(await isIRacingConnected())) {
    stopBroadcasting();

    return;
  }

  await Promise.all(Object.values(dashboardType).map(broadcastDashboard));

  if ([...clients.values()].every((clientSet) => clientSet.size === 0)) {
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

  resetInMemoryStorage();

  for (const set of clients.values()) {
    closeSSEStream(set);
  }
};

export type AddClientInput = {
  event: DashboardType;
  client: SSEClient;
};

export const addClient = ({ event, client }: AddClientInput) => {
  clients.get(event)?.add(client);
  startBroadcasting();
};

export type RemoveClientInput = {
  event: DashboardType;
  client: SSEClient;
};

export const removeClient = ({ event, client }: RemoveClientInput) => {
  const clientSet = clients.get(event) ?? new Set<SSEClient>();
  clientSet.delete(client);
};
