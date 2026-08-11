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

const writeToClients = async ({
  clientSet,
  data,
}: WriteToClientsInput): Promise<void> => {
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
  // biome-ignore lint/style/noNonNullAssertion: clients map is defined above
  const h2hClients = clients.get(dashboardType.H2H)!;
  if (h2hClients.size > 0) {
    const result = await computeHead2Head();
    if (result === null) {
      closeSSEStream(h2hClients);
    } else {
      await writeToClients({ clientSet: h2hClients, data: result });
    }
  }
};

const broadcastWeather = async () => {
  // biome-ignore lint/style/noNonNullAssertion: clients map is defined above
  const weatherClients = clients.get(dashboardType.WEATHER)!;
  if (weatherClients.size > 0) {
    await writeToClients({
      clientSet: weatherClients,
      data: await computeWeather(),
    });
  }
};

const broadcastCar = async () => {
  // biome-ignore lint/style/noNonNullAssertion: clients map is defined above
  const carClients = clients.get(dashboardType.CAR)!;
  if (carClients.size > 0) {
    await writeToClients({
      clientSet: carClients,
      data: await computeCarTelemetry(),
    });
  }
};

const broadcastFuel = async () => {
  // biome-ignore lint/style/noNonNullAssertion: clients map is defined above
  const fuelClients = clients.get(dashboardType.FUEL)!;
  if (fuelClients.size > 0) {
    const result = await computeFuel();
    if (result === null) {
      closeSSEStream(fuelClients);
    } else {
      await writeToClients({ clientSet: fuelClients, data: result });
    }
  }
};

const broadcastSpotter = async () => {
  // biome-ignore lint/style/noNonNullAssertion: clients map is defined above
  const spotterClients = clients.get(dashboardType.SPOTTER)!;
  if (spotterClients.size > 0) {
    await writeToClients({
      clientSet: spotterClients,
      data: await computeSpotter(),
    });
  }
};

const broadcastTraffic = async () => {
  // biome-ignore lint/style/noNonNullAssertion: clients map is defined above
  const trafficClients = clients.get(dashboardType.TRAFFIC)!;
  if (trafficClients.size > 0) {
    await writeToClients({
      clientSet: trafficClients,
      data: await computeTraffic(),
    });
  }
};

const broadcast = async (): Promise<void> => {
  if (!(await isIRacingConnected())) {
    stopBroadcasting();
    return;
  }

  await tick();

  await Promise.all([
    broadcastH2H(),
    broadcastWeather(),
    broadcastCar(),
    broadcastFuel(),
    broadcastSpotter(),
    broadcastTraffic(),
  ]);

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
