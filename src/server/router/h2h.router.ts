import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import { addClient, dashboardType, removeClient } from '#server/broadcaster.ts';

export const h2hRouter = (c: Context) =>
  streamSSE(c, async (stream) => {
    const client = {
      write: (data: string) => stream.writeSSE({ data }),
      close: () => stream.close(),
    };
    addClient(dashboardType.H2H, client);
    await new Promise<void>((resolve) => stream.onAbort(resolve));
    removeClient(dashboardType.H2H, client);
  });
