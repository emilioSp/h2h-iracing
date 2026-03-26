import { afterEach, describe, expect, it, vi } from 'vitest';
import * as iracingRepository from '#repository/irsdk.repository.ts';
import * as head2headService from '#service/head2head.service.ts';
import { sseRouter } from './sse.router.ts';

vi.mock('hono/streaming');

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

const makeStream = () => ({
  writeSSE: vi.fn().mockResolvedValue(undefined),
  sleep: vi.fn().mockResolvedValue(undefined),
});

const setupStreamSSE = async () => {
  const { streamSSE } = await import('hono/streaming');
  const stream = makeStream();
  let run: () => Promise<void>;

  vi.mocked(streamSSE).mockImplementationOnce((_c, cb, onErr) => {
    run = async () => {
      try {
        await cb(stream as never);
      } catch (err) {
        await onErr!(err as Error, stream as never);
      }
    };
    return new Response();
  });

  return { stream, run: () => run() };
};

describe('sseRouter', () => {
  it('writes error event when iRacing is not connected', async () => {
    const { stream, run } = await setupStreamSSE();
    vi.spyOn(iracingRepository, 'isIRacingConnected').mockReturnValue(false);

    sseRouter({} as never);
    await run();

    expect(stream.writeSSE).toHaveBeenCalledWith({
      event: 'error',
      data: 'iRacing is not available',
    });
  });

  it('writes error event when no active session', async () => {
    const { stream, run } = await setupStreamSSE();
    vi.spyOn(iracingRepository, 'isIRacingConnected').mockReturnValue(true);
    vi.spyOn(head2headService, 'computeHead2Head').mockReturnValue(null);

    sseRouter({} as never);
    await run();

    expect(stream.writeSSE).toHaveBeenCalledWith({
      event: 'error',
      data: 'No session is available',
    });
  });

  it('streams h2h data then writes disconnect error', async () => {
    const { stream, run } = await setupStreamSSE();
    vi.spyOn(iracingRepository, 'isIRacingConnected')
      .mockReturnValueOnce(true) // while check
      .mockReturnValueOnce(true) // inside computeHead2Head/tick
      .mockReturnValueOnce(false); // while check after sleep

    sseRouter({} as never);
    await run();

    expect(stream.writeSSE).toHaveBeenCalledTimes(2);
    const dataPayload = JSON.parse(stream.writeSSE.mock.calls[0][0].data);
    expect(dataPayload.data.sessionTime).toBeGreaterThan(0);
    expect(stream.writeSSE).toHaveBeenLastCalledWith({
      event: 'error',
      data: 'iRacing is not available',
    });
  });
});
