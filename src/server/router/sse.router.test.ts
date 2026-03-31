import { afterEach, describe, expect, it, vi } from 'vitest';
import * as iracingRepository from '#repository/irsdk.repository.ts';
import * as head2headService from '#service/head2head.service.ts';
import { sseRouter } from './sse.router.ts';

vi.mock('hono/streaming');

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

const mockStream = () => ({
  writeSSE: vi.fn().mockResolvedValue(undefined),
  sleep: vi.fn().mockResolvedValue(undefined),
});

const setupStreamSSE = async () => {
  const { streamSSE } = await import('hono/streaming');
  const stream = mockStream();
  let run: () => Promise<void>;

  vi.mocked(streamSSE).mockImplementationOnce((_c, cb) => {
    run = async () => {
      return await cb(stream as never);
    };
    return new Response();
  });

  return { stream, run: () => run() };
};

describe('sseRouter', () => {
  it('writes error event when iRacing is not connected', async () => {
    const { run } = await setupStreamSSE();
    vi.spyOn(iracingRepository, 'isIRacingConnected').mockResolvedValue(false);

    sseRouter({} as never);
    try {
      await run();
    } catch (e) {
      expect(e instanceof Error && e.message).toBe('iRacing is not available');
    }
  });

  it('writes error event when no active session', async () => {
    const { run } = await setupStreamSSE();
    vi.spyOn(iracingRepository, 'isIRacingConnected').mockResolvedValue(true);
    vi.spyOn(head2headService, 'computeHead2Head').mockResolvedValue(null);

    sseRouter({} as never);
    try {
      await run();
    } catch (e: unknown) {
      expect(e instanceof Error && e.message).toBe('Standings not available');
    }
  });
});
