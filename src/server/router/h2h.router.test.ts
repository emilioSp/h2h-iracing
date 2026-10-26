// Verifies head-to-head SSE routing during regression tests.

import type { Context } from 'hono';
import type { SSEStreamingApi } from 'hono/streaming';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { h2hRouter } from '#router/h2h.router.ts';
import * as broadcasterService from '#server/broadcaster.ts';
import { dashboardType } from '#server/broadcaster.ts';

vi.mock('hono/streaming');

vi.mock(import('#server/broadcaster.ts'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    addClient: vi.fn<typeof actual.addClient>(),
    removeClient: vi.fn<typeof actual.removeClient>(),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

const setupStreamSSE = async () => {
  const { streamSSE } = await import('hono/streaming');

  const stream = {
    writeSSE: vi.fn<SSEStreamingApi['writeSSE']>().mockResolvedValue(undefined),
    onAbort: vi.fn<SSEStreamingApi['onAbort']>(),
    close: vi.fn<SSEStreamingApi['close']>().mockResolvedValue(undefined),
  };

  let run: () => Promise<void>;

  vi.mocked(streamSSE).mockImplementationOnce((_c, cb) => {
    // JUSTIFICATION: The router only uses writeSSE, onAbort and close, all provided by this stream double.
    run = async () => cb(stream as never);

    return new Response();
  });

  return { stream, run: () => run() };
};

describe('h2hRouter', () => {
  it('given a head-to-head stream when a client connects then it is registered with the broadcaster', async () => {
    const { stream, run } = await setupStreamSSE();
    vi.mocked(stream.onAbort).mockImplementationOnce((cb) => cb());

    // JUSTIFICATION: The mocked streamSSE ignores the context, so this test needs no Hono request.
    h2hRouter({} as Context);
    await run();

    expect(broadcasterService.addClient).toHaveBeenCalledWith({
      event: dashboardType.H2H,
      client: expect.objectContaining({ write: expect.any(Function) }),
    });
  });

  it('given a registered head-to-head client when the stream aborts then the client is removed from the broadcaster', async () => {
    const { stream, run } = await setupStreamSSE();
    vi.mocked(stream.onAbort).mockImplementationOnce((cb) => cb());

    // JUSTIFICATION: The mocked streamSSE ignores the context, so this test needs no Hono request.
    h2hRouter({} as Context);
    await run();

    expect(broadcasterService.removeClient).toHaveBeenCalledWith({
      event: dashboardType.H2H,
      client: expect.objectContaining({ write: expect.any(Function) }),
    });
  });

  it('given a registered head-to-head client when its write function is called then the data is sent through stream.writeSSE', async () => {
    const { stream, run } = await setupStreamSSE();
    vi.mocked(stream.onAbort).mockImplementationOnce((cb) => cb());

    // JUSTIFICATION: The mocked streamSSE ignores the context, so this test needs no Hono request.
    h2hRouter({} as Context);
    await run();

    const client = vi.mocked(broadcasterService.addClient).mock.calls[0][0].client;
    await client.write('test-data');

    expect(stream.writeSSE).toHaveBeenCalledWith({ data: 'test-data' });
  });
});
