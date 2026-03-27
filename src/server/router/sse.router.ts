import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import config from '#config';
import { isIRacingConnected } from '#repository/irsdk.repository.ts';
import { computeHead2Head } from '#service/head2head.service.ts';

export const sseRouter = (c: Context) =>
  streamSSE(c, async (stream) => {
    while (isIRacingConnected() && !stream.aborted) {
      const h2h = computeHead2Head();
      if (!h2h) {
        throw new Error('No session is available');
      }

      const json = JSON.stringify({ data: h2h });
      await stream.writeSSE({ data: json });
      await stream.sleep(config.POLL_INTERVAL_MS);
    }
    throw new Error('iRacing is not available');
  });
