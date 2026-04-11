import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('#repository/irsdk.repository.ts', () => ({
  getLapDistPct: vi.fn(),
  getLapsCompleted: vi.fn(),
  getClassPositions: vi.fn(),
}));

vi.mock('#service/driver.service.ts', () => ({
  getCarIdxs: vi.fn(),
}));

import {
  getClassPositions,
  getLapDistPct,
  getLapsCompleted,
} from '#repository/irsdk.repository.ts';
import { getCarIdxs } from '#service/driver.service.ts';
import {
  getRaceStandings,
  getSessionStandings,
  getStandings,
} from '#service/standings.service.ts';

const mockGetLapDistPct = vi.mocked(getLapDistPct);
const mockGetLapsCompleted = vi.mocked(getLapsCompleted);
const mockGetClassPositions = vi.mocked(getClassPositions);
const mockGetCarIdxs = vi.mocked(getCarIdxs);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getRaceStandings', () => {
  it('sorts cars by total distance descending and assigns positions', async () => {
    mockGetCarIdxs.mockResolvedValue([1, 2, 3]);
    mockGetLapDistPct.mockResolvedValue([0, 0.8, 0.5, 0.3]);
    mockGetLapsCompleted.mockResolvedValue([0, 5, 5, 6]);

    const standings = await getRaceStandings();

    expect(standings).toEqual([
      { pos: 1, carIdx: 3 },
      { pos: 2, carIdx: 1 },
      { pos: 3, carIdx: 2 },
    ]);
  });
});

describe('getSessionStandings', () => {
  it('maps class positions and sorts ascending', async () => {
    mockGetCarIdxs.mockResolvedValue([1, 2, 3]);
    mockGetClassPositions.mockResolvedValue([0, 3, 1, 2]);

    const standings = await getSessionStandings();

    expect(standings).toEqual([
      { pos: 1, carIdx: 2 },
      { pos: 2, carIdx: 3 },
      { pos: 3, carIdx: 1 },
    ]);
  });

  it('excludes cars with class position 0 (no time set)', async () => {
    mockGetCarIdxs.mockResolvedValue([1, 2, 3]);
    mockGetClassPositions.mockResolvedValue([0, 0, 1, 2]);

    const standings = await getSessionStandings();

    expect(standings).toEqual([
      { pos: 1, carIdx: 2 },
      { pos: 2, carIdx: 3 },
    ]);
    expect(standings.some((s) => s.carIdx === 1)).toBe(false);
  });

  it('returns empty array when all cars have no time set', async () => {
    mockGetCarIdxs.mockResolvedValue([1, 2]);
    mockGetClassPositions.mockResolvedValue([0, 0, 0]);

    const standings = await getSessionStandings();

    expect(standings).toEqual([]);
  });
});

describe('getStandings', () => {
  it('delegates to getRaceStandings when isRace is true', async () => {
    mockGetCarIdxs.mockResolvedValue([1, 2]);
    mockGetLapDistPct.mockResolvedValue([0, 0.5, 0.3]);
    mockGetLapsCompleted.mockResolvedValue([0, 3, 4]);

    const standings = await getStandings(true);

    expect(standings).toEqual([
      { pos: 1, carIdx: 2 },
      { pos: 2, carIdx: 1 },
    ]);
  });

  it('delegates to getSessionStandings when isRace is false', async () => {
    mockGetCarIdxs.mockResolvedValue([1, 2]);
    mockGetClassPositions.mockResolvedValue([0, 2, 1]);

    const standings = await getStandings(false);

    expect(standings).toEqual([
      { pos: 1, carIdx: 2 },
      { pos: 2, carIdx: 1 },
    ]);
  });
});
