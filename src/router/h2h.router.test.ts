import { describe, expect, it, vi } from 'vitest';
import * as head2headService from '#service/head2head.service.ts';
import { h2hRouter } from './h2h.router.ts';

const makeCtx = () => ({ json: vi.fn() });

describe('h2h.router', () => {
  it('returns 503 when no active session', () => {
    vi.spyOn(head2headService, 'computeHead2Head').mockReturnValue(null);
    const c = makeCtx();
    h2hRouter(c as never);
    expect(c.json).toHaveBeenCalledWith(
      { error: { code: 'NO_SESSION', message: 'No active race session' } },
      503,
    );
    vi.restoreAllMocks();
  });

  it('returns 200 with Head2Head data from mock session', () => {
    const c = makeCtx();
    h2hRouter(c as never);
    const [body, status] = c.json.mock.calls[0];
    expect(status).toBeUndefined(); // no explicit status = 200
    expect(body.data).toBeDefined();
    expect(body.data.sessionTime).toBeGreaterThan(0);
    expect(body.data.player.position).toBeGreaterThan(0);
    expect(body.data.player.driver.name).toBeTruthy();
  });
});
