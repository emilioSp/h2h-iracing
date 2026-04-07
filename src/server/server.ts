import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import config from '#config';
import { shutdown } from '#repository/irsdk.repository.ts';
import { h2hRouter } from '#router/h2h.router.ts';

const app = new Hono();

app.get('/sse/h2h', h2hRouter);
app.get('/h2h', serveStatic({ path: './dist/h2h-dashboard/index.html' }));
app.use('/*', serveStatic({ root: './dist' }));

const server = serve(
  { fetch: app.fetch, port: config.PORT, hostname: '127.0.0.1' },
  (info) => {
    console.log(`Server running on http://localhost:${info.port}`);
    console.log(
      `Mode: ${config.DATA_MODE} | Poll: ${config.POLL_INTERVAL_MS}ms`,
    );
  },
);

process.on('SIGINT', async () => {
  await shutdown();
  server.close();
  console.log('\nShutdown complete');
  process.exit(0);
});
