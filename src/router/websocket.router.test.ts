import { afterEach, describe, expect, it, vi } from 'vitest';
import * as head2headService from '#service/head2head.service.ts';
import {
  broadcastHead2Head,
  closeAllClients,
  wsHandler,
} from './websocket.router.ts';


const makeWs = () => ({ send: vi.fn(), close: vi.fn() });

afterEach(() => {
  closeAllClients();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('wsHandler', () => {
  it('adds client on open, removes on close', () => {
    const ws = makeWs();
    const handler = wsHandler();

    handler.onOpen(new Event('open'), ws);
    broadcastHead2Head();
    expect(ws.send).toHaveBeenCalledOnce();

    handler.onClose(new Event('close'), ws);
    broadcastHead2Head();
    expect(ws.send).toHaveBeenCalledOnce(); // still only once — client was removed
  });
});

describe('broadcastHead2Head', () => {
  it('does nothing when no clients connected', () => {
    const spy = vi.spyOn(head2headService, 'computeHead2Head');
    broadcastHead2Head();
    expect(spy).not.toHaveBeenCalled();
  });

  it('does nothing when computeHead2Head returns null', () => {
    const ws = makeWs();
    wsHandler().onOpen(new Event('open'), ws);
    vi.spyOn(head2headService, 'computeHead2Head').mockReturnValue(null);
    broadcastHead2Head();
    expect(ws.send).not.toHaveBeenCalled();
  });

  it('sends JSON with real data to all connected clients', () => {
    const ws1 = makeWs();
    const ws2 = makeWs();
    wsHandler().onOpen(new Event('open'), ws1);
    wsHandler().onOpen(new Event('open'), ws2);

    broadcastHead2Head();

    expect(ws1.send).toHaveBeenCalledOnce();
    expect(ws2.send).toHaveBeenCalledOnce();
    const payload = JSON.parse(ws1.send.mock.calls[0][0]);
    expect(payload.data.sessionTime).toBeGreaterThan(0);
    expect(payload.data.player.position).toBeGreaterThan(0);
  });
});

describe('closeAllClients', () => {
  it('calls close on all connected clients', () => {
    const ws1 = makeWs();
    const ws2 = makeWs();
    wsHandler().onOpen(new Event('open'), ws1);
    wsHandler().onOpen(new Event('open'), ws2);

    closeAllClients();

    expect(ws1.close).toHaveBeenCalledOnce();
    expect(ws2.close).toHaveBeenCalledOnce();
  });
});
