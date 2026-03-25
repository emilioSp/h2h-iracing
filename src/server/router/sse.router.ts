import type { Context } from 'hono';
import { type SSEStreamingApi, streamSSE } from 'hono/streaming';
import config from '#config';
import { computeHead2Head } from '#service/head2head.service.ts';

const sseClients = new Set<SSEStreamingApi>();

export const sseHandler = (c: Context) =>
  streamSSE(
    c,
    (stream) =>
      new Promise<void>((resolve) => {
        sseClients.add(stream);
        stream.onAbort(() => {
          sseClients.delete(stream);
          resolve();
        });
      }),
  );

export const broadcastHead2Head = async () => {
  if (sseClients.size === 0) return;

  const h2h = computeHead2Head();
  if (!h2h) return;

  const json = JSON.stringify({ data: h2h });
  for (const stream of sseClients) {
    await stream.writeSSE({ data: json });
  }
};

export const closeAllClients = () => {
  for (const stream of sseClients) {
    stream.abort();
  }
};

const broadcast = async () => {
  await broadcastHead2Head();
  setTimeout(() => broadcast(), config.POLL_INTERVAL_MS);
};

await broadcast();
