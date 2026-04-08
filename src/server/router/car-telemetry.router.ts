import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import config from '#config';
import { isIRacingConnected } from '#repository/irsdk.repository.ts';
import { debug } from '#server/debug.ts';
import { computeCarTelemetry } from '#service/car-telemetry.service.ts';

export const carTelemetryRouter = (c: Context) =>
  streamSSE(c, async (stream) => {
    while ((await isIRacingConnected()) && !stream.aborted) {
      const car = await computeCarTelemetry();
      await stream.writeSSE({ data: JSON.stringify({ data: car }) });
      await stream.sleep(config.POLL_INTERVAL_MS);
    }
    debug('iRacing is not connected, stopping SSE stream');
  });
