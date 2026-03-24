import config from '#config';
import { computeHead2Head } from '#service/head2head.service.ts';

type WsClient = {
  send: (data: string) => void;
  close: () => void;
};

const wsClients = new Set<WsClient>();

export const wsHandler = () => ({
  onOpen(_event: Event, ws: WsClient) {
    wsClients.add(ws);
  },
  onClose(_event: Event, ws: WsClient) {
    wsClients.delete(ws);
  },
});

export const broadcastHead2Head = () => {
  if (wsClients.size === 0) return;

  const h2h = computeHead2Head();
  if (!h2h) {
    return;
  }

  const json = JSON.stringify({ data: h2h });
  for (const ws of wsClients) {
    ws.send(json);
  }
};

export const closeAllClients = () => {
  for (const ws of wsClients) {
    ws.close();
  }
};

const broadcast = async () => {
  broadcastHead2Head();
  setTimeout(() => broadcast(), config.POLL_INTERVAL_MS);
};

await broadcast();
