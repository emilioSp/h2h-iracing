// Opens the h2h SSE stream when an overlay subscribes.
import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';

import { dashboardType } from '#common/constants/dashboard-type.ts';
import broadcaster from '#server/broadcaster.ts';

export const h2hRouter = (c: Context) =>
  streamSSE(c, async (stream) => {
    const client = {
      write: (data: string) => stream.writeSSE({ data }),
      close: () => stream.close(),
    };

    broadcaster.addClient({ event: dashboardType.H2H, client });
    await new Promise<void>((resolve) => stream.onAbort(resolve));
    broadcaster.removeClient({ event: dashboardType.H2H, client });
  });
