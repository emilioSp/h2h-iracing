import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import config from '#config';
import { shutdown } from '#repository/irsdk.repository.ts';
import { sseRouter } from '#router/sse.router.ts';

const app = new Hono();

app.get('/sse', sseRouter);
app.use('/*', serveStatic({ root: './dist/ui' }));

const server = serve({ fetch: app.fetch, port: config.PORT, hostname: '127.0.0.1' }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
  console.log(`Mode: ${config.DATA_MODE} | Poll: ${config.POLL_INTERVAL_MS}ms`);
});

process.on('SIGINT', async () => {
  await shutdown();
  server.close();
  console.log('\nShutdown complete');
  process.exit(0);
});
