import { afterEach, describe, expect, it, vi } from 'vitest';
import * as broadcasterService from '#service/broadcaster.service.ts';
import { dashboardType } from '#service/broadcaster.service.ts';
import { h2hRouter } from './h2h.router.ts';

vi.mock('hono/streaming');

vi.mock(import('#service/broadcaster.service.ts'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    addClient: vi.fn(),
    removeClient: vi.fn(),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

const setupStreamSSE = async () => {
  const { streamSSE } = await import('hono/streaming');
  const stream = {
    writeSSE: vi.fn().mockResolvedValue(undefined),
    onAbort: vi.fn(),
  };
  let run: () => Promise<void>;

  vi.mocked(streamSSE).mockImplementationOnce((_c, cb) => {
    run = async () => cb(stream as never);
    return new Response();
  });

  return { stream, run: () => run() };
};

describe('h2hRouter', () => {
  it('registers client with broadcaster on connect', async () => {
    const { stream, run } = await setupStreamSSE();
    vi.mocked(stream.onAbort).mockImplementationOnce((cb) => cb());

    h2hRouter({} as never);
    await run();

    expect(broadcasterService.addClient).toHaveBeenCalledWith(
      dashboardType.H2H,
      expect.objectContaining({ write: expect.any(Function) }),
    );
  });

  it('deregisters client from broadcaster on abort', async () => {
    const { stream, run } = await setupStreamSSE();
    vi.mocked(stream.onAbort).mockImplementationOnce((cb) => cb());

    h2hRouter({} as never);
    await run();

    expect(broadcasterService.removeClient).toHaveBeenCalledWith(
      dashboardType.H2H,
      expect.objectContaining({ write: expect.any(Function) }),
    );
  });

  it('passes write function that calls stream.writeSSE', async () => {
    const { stream, run } = await setupStreamSSE();
    vi.mocked(stream.onAbort).mockImplementationOnce((cb) => cb());

    h2hRouter({} as never);
    await run();

    const client = vi.mocked(broadcasterService.addClient).mock.calls[0][1];
    await client.write('test-data');

    expect(stream.writeSSE).toHaveBeenCalledWith({ data: 'test-data' });
  });
});
