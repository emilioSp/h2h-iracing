import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import { addClient, dashboardType, removeClient } from '#server/broadcaster.ts';

export const weatherRouter = (c: Context) =>
  streamSSE(c, async (stream) => {
    const client = {
      write: (data: string) => stream.writeSSE({ data }),
      close: () => stream.close(),
    };
    addClient(dashboardType.WEATHER, client);
    await new Promise<void>((resolve) => stream.onAbort(resolve));
    removeClient(dashboardType.WEATHER, client);
  });
