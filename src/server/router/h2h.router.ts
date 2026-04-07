import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import config from '#config';
import { isIRacingConnected } from '#repository/irsdk.repository.ts';
import { debug } from '#server/debug.ts';
import {
  computeHead2Head,
  resetSessionNumber,
} from '#service/head2head.service.ts';
import { resetReferenceLaps } from '#service/reference-lap.service.ts';

export const h2hRouter = (c: Context) =>
  streamSSE(c, async (stream) => {
    while ((await isIRacingConnected()) && !stream.aborted) {
      const h2h = await computeHead2Head();
      if (!h2h) {
        throw new Error('Session not available');
      }

      const json = JSON.stringify({ data: h2h });
      await stream.writeSSE({ data: json });
      await stream.sleep(config.POLL_INTERVAL_MS);
    }
    resetReferenceLaps();
    resetSessionNumber();
    debug('iRacing is not connected, stopping SSE stream');
  });
