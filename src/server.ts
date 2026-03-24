import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import config from '#config';
import { shutdown } from '#repository/irsdk.repository.ts';
import { h2hRouter } from '#router/h2h.router.ts';
import { closeAllClients, sseHandler } from '#router/sse.router.ts';

const app = new Hono();

app.get('/api/h2h', h2hRouter);
app.get('/sse', sseHandler);

const server = serve({ fetch: app.fetch, port: config.PORT }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
  console.log(`Mode: ${config.DATA_MODE} | Poll: ${config.POLL_INTERVAL_MS}ms`);
});

process.on('SIGINT', () => {
  closeAllClients();
  shutdown();
  server.close();
  console.log('\nShutdown complete');
  process.exit(0);
});
