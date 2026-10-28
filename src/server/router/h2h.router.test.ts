// Verifies head-to-head SSE routing during regression tests.

import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import type { SSEStreamingApi } from 'hono/streaming';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { dashboardType } from '#common/constants/dashboard-type.ts';
import { h2hRouter } from '#router/h2h.router.ts';
import broadcasterService from '#server/broadcaster.ts';

vi.mock('hono/streaming');

beforeEach(() => {
  vi.spyOn(broadcasterService, 'addClient').mockImplementation(() => {});
  vi.spyOn(broadcasterService, 'removeClient').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('h2hRouter', () => {
  it('given a head-to-head stream when a client connects then it is registered with the broadcaster', async () => {
    const stream = {
      writeSSE: vi.fn<SSEStreamingApi['writeSSE']>().mockResolvedValue(undefined),
      onAbort: vi.fn<SSEStreamingApi['onAbort']>().mockImplementationOnce((callback) => callback()),
      close: vi.fn<SSEStreamingApi['close']>().mockResolvedValue(undefined),
    };

    // JUSTIFICATION: The mocked streamSSE ignores the context, so this test needs no Hono request.
    h2hRouter({} as Context);
    // JUSTIFICATION: The route only uses writeSSE, onAbort, and close, supplied by this stream double.
    await vi.mocked(streamSSE).mock.calls[0][1](stream as never);

    expect(broadcasterService.addClient).toHaveBeenCalledWith({
      event: dashboardType.H2H,
      client: expect.objectContaining({ write: expect.any(Function) }),
    });
  });

  it('given a registered head-to-head client when the stream aborts then the client is removed from the broadcaster', async () => {
    const stream = {
      writeSSE: vi.fn<SSEStreamingApi['writeSSE']>().mockResolvedValue(undefined),
      onAbort: vi.fn<SSEStreamingApi['onAbort']>().mockImplementationOnce((callback) => callback()),
      close: vi.fn<SSEStreamingApi['close']>().mockResolvedValue(undefined),
    };

    // JUSTIFICATION: The mocked streamSSE ignores the context, so this test needs no Hono request.
    h2hRouter({} as Context);
    // JUSTIFICATION: The route only uses writeSSE, onAbort, and close, supplied by this stream double.
    await vi.mocked(streamSSE).mock.calls[0][1](stream as never);

    expect(broadcasterService.removeClient).toHaveBeenCalledWith({
      event: dashboardType.H2H,
      client: expect.objectContaining({ write: expect.any(Function) }),
    });
  });

  it('given a registered head-to-head client when its write function is called then the data is sent through stream.writeSSE', async () => {
    const stream = {
      writeSSE: vi.fn<SSEStreamingApi['writeSSE']>().mockResolvedValue(undefined),
      onAbort: vi.fn<SSEStreamingApi['onAbort']>().mockImplementationOnce((callback) => callback()),
      close: vi.fn<SSEStreamingApi['close']>().mockResolvedValue(undefined),
    };

    // JUSTIFICATION: The mocked streamSSE ignores the context, so this test needs no Hono request.
    h2hRouter({} as Context);
    // JUSTIFICATION: The route only uses writeSSE, onAbort, and close, supplied by this stream double.
    await vi.mocked(streamSSE).mock.calls[0][1](stream as never);

    const client = vi.mocked(broadcasterService.addClient).mock.calls[0][0].client;
    await client.write('test-data');

    expect(stream.writeSSE).toHaveBeenCalledWith({ data: 'test-data' });
  });
});
