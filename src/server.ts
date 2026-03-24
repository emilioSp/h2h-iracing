import { serve } from '@hono/node-server';
import { createNodeWebSocket } from '@hono/node-ws';
import { Hono } from 'hono';
import config from '#config';
import { shutdown } from '#repository/irsdk.repository.ts';
import { h2hRouter } from '#router/h2h.router.ts';
import { closeAllClients, wsHandler } from '#router/websocket.router.ts';

const app = new Hono();
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.get('/api/h2h', h2hRouter);
app.get('/ws', upgradeWebSocket(wsHandler));

const server = serve({ fetch: app.fetch, port: config.PORT }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
  console.log(`Mode: ${config.DATA_MODE} | Poll: ${config.POLL_INTERVAL_MS}ms`);
});

injectWebSocket(server);

process.on('SIGINT', () => {
  closeAllClients();
  shutdown();
  server.close();
  console.log('\nShutdown complete');
  process.exit(0);
});
