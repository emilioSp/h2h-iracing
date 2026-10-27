import { dashboardType, type DashboardType } from '#common/constants/dashboard-type.ts';
// Sends dashboard updates to subscribed SSE clients while polling iRacing.
import { config } from '#config';
import { computeCarTelemetry } from '#dashboard/car-telemetry.dashboard.ts';
import { computeFuel } from '#dashboard/fuel.dashboard.ts';
import { computeHead2Head } from '#dashboard/head2head.dashboard.ts';
import { computeSpotter } from '#dashboard/spotter.dashboard.ts';
import { computeTraffic } from '#dashboard/traffic.dashboard.ts';
import { computeWeather } from '#dashboard/weather.dashboard.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import telemetryTick from '#server/tick.ts';

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

type WriteToClientsInput = {
  clientSet: Set<SSEClient>;
  data: unknown;
};

export type AddClientInput = {
  event: DashboardType;
  client: SSEClient;
};

export type RemoveClientInput = {
  event: DashboardType;
  client: SSEClient;
};

export class Broadcaster {
  private readonly clients: Map<DashboardType, Set<SSEClient>> = new Map([
    [dashboardType.H2H, new Set()],
    [dashboardType.WEATHER, new Set()],
    [dashboardType.CAR, new Set()],
    [dashboardType.FUEL, new Set()],
    [dashboardType.SPOTTER, new Set()],
    [dashboardType.TRAFFIC, new Set()],
  ]);

  private timer: ReturnType<typeof setTimeout> | null = null;

  private closeSSEStream = (set: Set<SSEClient>) => {
    for (const client of set) {
      client.close();
    }

    set.clear();
  };

  private writeToClients = async ({ clientSet, data }: WriteToClientsInput): Promise<void> => {
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

  private broadcastDashboard = async (event: DashboardType): Promise<void> => {
    const clientSet = this.clients.get(event);

    if (!clientSet || clientSet.size === 0) return;

    const data = await dashboardComputations[event]();

    await this.writeToClients({ clientSet, data });
  };

  private broadcast = async (): Promise<void> => {
    await telemetryTick.tick();

    if (!(await irsdkRepository.isIRacingConnected())) {
      this.stopBroadcasting();

      return;
    }

    await Promise.all(Object.values(dashboardType).map(this.broadcastDashboard));

    if ([...this.clients.values()].every((clientSet) => clientSet.size === 0)) {
      this.stopBroadcasting();

      return;
    }

    this.timer = setTimeout(this.broadcast, config.POLL_INTERVAL_MS);
  };

  private startBroadcasting = () => {
    if (this.timer !== null) return;
    this.timer = setTimeout(this.broadcast, config.POLL_INTERVAL_MS);
  };

  stopBroadcasting = () => {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    telemetryTick.resetInMemoryStorage();

    for (const set of this.clients.values()) {
      this.closeSSEStream(set);
    }
  };

  addClient = ({ event, client }: AddClientInput) => {
    this.clients.get(event)?.add(client);
    this.startBroadcasting();
  };

  removeClient = ({ event, client }: RemoveClientInput) => {
    const clientSet = this.clients.get(event) ?? new Set<SSEClient>();
    clientSet.delete(client);
  };
}

export default new Broadcaster();
