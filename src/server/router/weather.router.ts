import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import config from '#config';
import { isIRacingConnected } from '#repository/irsdk.repository.ts';
import { debug } from '#server/debug.ts';
import { computeWeather } from '#service/weather.service.ts';

export const weatherRouter = (c: Context) =>
  streamSSE(c, async (stream) => {
    while ((await isIRacingConnected()) && !stream.aborted) {
      const weather = await computeWeather();
      await stream.writeSSE({ data: JSON.stringify({ data: weather }) });
      await stream.sleep(config.POLL_INTERVAL_WEATHER_MS);
    }
    debug('iRacing is not connected, stopping SSE stream');
  });
