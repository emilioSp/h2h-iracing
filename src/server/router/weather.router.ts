// Opens the weather SSE stream when an overlay subscribes.
import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';

import { dashboardType } from '#common/constants/dashboard-type.ts';
import broadcaster from '#server/broadcaster.ts';

export const weatherRouter = (c: Context) =>
  streamSSE(c, async (stream) => {
    const client = {
      write: (data: string) => stream.writeSSE({ data }),
      close: () => stream.close(),
    };

    broadcaster.addClient({ event: dashboardType.WEATHER, client });
    await new Promise<void>((resolve) => stream.onAbort(resolve));
    broadcaster.removeClient({ event: dashboardType.WEATHER, client });
  });
