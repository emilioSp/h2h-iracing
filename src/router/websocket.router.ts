import config from '#config';
import { computeBattleState } from '#service/battle.service.ts';

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

export const broadcastState = () => {
  if (wsClients.size === 0) return;

  const state = computeBattleState();
  if (!state) {
    return;
  }

  const json = JSON.stringify({ data: state });
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
  broadcastState();
  setTimeout(() => broadcast(), config.POLL_INTERVAL_MS);
};

await broadcast();
