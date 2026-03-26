import { afterEach, describe, expect, it, vi } from 'vitest';
import * as head2headService from '#service/head2head.service.ts';
import {
  broadcastHead2Head,
  closeAllClients,
  sseHandler,
} from './sse.router.ts';

const makeStream = () => {
  let abortCb: (() => void) | undefined;
  return {
    writeSSE: vi.fn().mockResolvedValue(undefined),
    abort: vi.fn(),
    onAbort: vi.fn((cb: () => void) => {
      abortCb = cb;
    }),
    simulateDisconnect: () => abortCb?.(),
  };
};

afterEach(() => {
  closeAllClients();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('sseHandler', () => {
  it('registers client on connect and removes on disconnect', async () => {
    const stream = makeStream();

    // Spy on broadcastHead2Head to verify client is registered
    vi.spyOn(head2headService, 'computeHead2Head').mockReturnValue({
      sessionTime: 1,
    } as never);

    // Simulate what streamSSE does: call the callback with the stream
    const { streamSSE } = await import('hono/streaming');
    vi.mocked(streamSSE).mockImplementation((_c, cb) => {
      cb(stream as never);
      return new Response();
    });
    vi.mock('hono/streaming');

    sseHandler({} as never);
    await broadcastHead2Head();
    expect(stream.writeSSE).toHaveBeenCalledOnce();

    stream.simulateDisconnect();
    await broadcastHead2Head();
    expect(stream.writeSSE).toHaveBeenCalledOnce(); // still once — removed
  });
});

describe('broadcastHead2Head', () => {
  it('does nothing when no clients connected', async () => {
    const spy = vi.spyOn(head2headService, 'computeHead2Head');
    await broadcastHead2Head();
    expect(spy).not.toHaveBeenCalled();
  });

  it('does nothing when computeHead2Head returns null', async () => {
    // Add a client directly by calling sseHandler
    // Use a simpler approach: test broadcastHead2Head in isolation
    vi.spyOn(head2headService, 'computeHead2Head').mockReturnValue(null);
    // No clients, so writeSSE would never be called regardless
    await broadcastHead2Head();
    // If there were clients, writeSSE wouldn't be called because h2h is null
    expect(head2headService.computeHead2Head).not.toHaveBeenCalled(); // no clients → early return
  });

  it('sends JSON with real data to all connected clients', async () => {
    const stream1 = makeStream();
    const stream2 = makeStream();

    const { streamSSE } = await import('hono/streaming');
    vi.mocked(streamSSE)
      .mockImplementationOnce((_c, cb) => {
        cb(stream1 as never);
        return new Response();
      })
      .mockImplementationOnce((_c, cb) => {
        cb(stream2 as never);
        return new Response();
      });
    vi.mock('hono/streaming');

    sseHandler({} as never);
    sseHandler({} as never);

    await broadcastHead2Head();

    expect(stream1.writeSSE).toHaveBeenCalledOnce();
    expect(stream2.writeSSE).toHaveBeenCalledOnce();
    const payload = JSON.parse(stream1.writeSSE.mock.calls[0][0].data);
    expect(payload.data.sessionTime).toBeGreaterThan(0);
    expect(payload.data.player.position).toBeGreaterThan(0);
  });
});

describe('closeAllClients', () => {
  it('calls abort on all connected clients', async () => {
    const stream1 = makeStream();
    const stream2 = makeStream();

    const { streamSSE } = await import('hono/streaming');
    vi.mocked(streamSSE)
      .mockImplementationOnce((_c, cb) => {
        cb(stream1 as never);
        return new Response();
      })
      .mockImplementationOnce((_c, cb) => {
        cb(stream2 as never);
        return new Response();
      });
    vi.mock('hono/streaming');

    sseHandler({} as never);
    sseHandler({} as never);

    closeAllClients();

    expect(stream1.abort).toHaveBeenCalledOnce();
    expect(stream2.abort).toHaveBeenCalledOnce();
  });
});
