import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import config from '#config';
import { shutdown } from '#repository/irsdk.repository.ts';
import { carTelemetryRouter } from '#router/car-telemetry.router.ts';
import { fuelRouter } from '#router/fuel.router.ts';
import { h2hRouter } from '#router/h2h.router.ts';
import { weatherRouter } from '#router/weather.router.ts';
import { stopBroadcasting } from '#server/broadcaster.ts';

const app = new Hono();

app.get('/sse/h2h', h2hRouter);
app.get('/sse/weather', weatherRouter);
app.get('/sse/car', carTelemetryRouter);
app.get('/sse/fuel', fuelRouter);
app.get('/h2h', serveStatic({ path: './dist/h2h-dashboard/index.html' }));
app.get('/car', serveStatic({ path: './dist/car-dashboard/index.html' }));
app.use('/*', serveStatic({ root: './dist' }));

const server = serve(
  { fetch: app.fetch, port: config.PORT, hostname: '127.0.0.1' },
  (info) => {
    console.log(`Server running on http://localhost:${info.port}`);

    console.log('Dashboards:');
    console.table({
      'Head to Head': { URL: `http://localhost:${info.port}/h2h-dashboard` },
      'Car Telemetry': { URL: `http://localhost:${info.port}/car-dashboard` },
      Weather: { URL: `http://localhost:${info.port}/weather-dashboard` },
    });

    console.log(
      `Mode: ${config.DATA_MODE} | Poll: ${config.POLL_INTERVAL_MS}ms`,
    );

    if (config.DATA_MODE === 'live') {
      console.log('Do NOT close this window...');
    }
  },
);

const cleanShutdown = async () => {
  stopBroadcasting();
  await shutdown();
  server.close();
  console.log('\nShutdown complete');
  process.exit(0);
};

process.on('SIGINT', cleanShutdown);
process.on('SIGTERM', cleanShutdown);
