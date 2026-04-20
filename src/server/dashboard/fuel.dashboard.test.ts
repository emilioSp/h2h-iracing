import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  computeFuel,
  computeLapsRemaining,
} from '#dashboard/fuel.dashboard.ts';
import { FUEL_SAMPLE_WINDOW } from '#repository/fuel.repository.ts';
import * as iracingRepository from '#repository/irsdk.repository.ts';
import * as sessionInfoRepository from '#repository/session-info.repository.ts';
import { resetInMemoryStorage, tick } from '#server/tick.ts';

beforeEach(async () => {
  vi.restoreAllMocks();
  await tick();
  resetInMemoryStorage();
  vi.spyOn(sessionInfoRepository, 'isRaceSession').mockReturnValue(true);
  vi.spyOn(iracingRepository, 'getSessionFlags').mockResolvedValue(0);
  vi.spyOn(iracingRepository, 'getOverallPositions').mockResolvedValue([
    1,
    ...Array(63).fill(2),
  ]);
});

describe('computeFuel — race session', () => {
  it('returns partial result before enough samples accumulate', async () => {
    const result = await computeFuel();
    expect(result).not.toBeNull();
    expect(result?.fuelRefillNoMarginLap).toBeNull();
    expect(result?.fuelRefillForHalfMarginLap).toBeNull();
    expect(result?.fuelRefillFor1MarginLap).toBeNull();
  });

  it('returns values once samples accumulate and preserves ordering', async () => {
    let lap = 0;
    vi.spyOn(iracingRepository, 'getPlayerCarIdx').mockResolvedValue(0);
    vi.spyOn(iracingRepository, 'getLapsCompleted').mockImplementation(
      async () => {
        const arr = Array(64).fill(lap);
        lap++;
        return arr;
      },
    );
    vi.spyOn(iracingRepository, 'getFuelLevel').mockImplementation(
      async () => 50 - lap * 2,
    );
    vi.spyOn(iracingRepository, 'getSessionTimeRemain').mockResolvedValue(
      14_400,
    ); // 4 hours
    vi.spyOn(iracingRepository, 'getLapDistPct').mockResolvedValue([
      0.6,
      ...Array(63).fill(0.5),
    ]);
    // biome-ignore lint/suspicious/noExplicitAny: overloaded spy requires any to accept number[]
    (vi.spyOn(iracingRepository, 'getLastLapTime') as any).mockResolvedValue(
      Array(64).fill(90),
    );

    // Call 1: only 1 fuel sample → no delta yet → refill null
    // Call 2+: 2+ fuel samples and 2+ lap time samples → medians computable → refill non-null
    for (let i = 0; i < FUEL_SAMPLE_WINDOW - 1; i++) {
      const result = await computeFuel();
      if (i < 1) {
        expect(result?.fuelRefillNoMarginLap).toBeNull();
      }
    }

    // Call FUEL_SAMPLE_WINDOW: FUEL_SAMPLE_WINDOW fuel samples + FUEL_SAMPLE_WINDOW lap time samples
    const result = await computeFuel();
    expect(result?.fuelRefillNoMarginLap).toBe(280.8);
    expect(result?.fuelRefillForHalfMarginLap).toBe(281.8);
    expect(result?.fuelRefillFor1MarginLap).toBe(282.8);
  });
});

describe('computeFuel — non-race session', () => {
  it('returns partial result with null refills', async () => {
    vi.spyOn(sessionInfoRepository, 'isRaceSession').mockReturnValue(false);
    const result = await computeFuel();
    expect(result).not.toBeNull();
    expect(result?.fuelRefillNoMarginLap).toBeNull();
    expect(result?.fuelRefillForHalfMarginLap).toBeNull();
    expect(result?.fuelRefillFor1MarginLap).toBeNull();
  });
});

describe('computeFuel — no player', () => {
  it('returns null when playerCarIdx < 0', async () => {
    vi.spyOn(iracingRepository, 'getPlayerCarIdx').mockResolvedValue(-1);
    const result = await computeFuel();
    expect(result).toBeNull();
  });
});

describe('computeFuel — session flags', () => {
  beforeEach(() => {
    vi.spyOn(iracingRepository, 'getPlayerCarIdx').mockResolvedValue(0);
    vi.spyOn(iracingRepository, 'getLapDistPct').mockResolvedValue(
      Array(64).fill(0.5),
    );
    vi.spyOn(iracingRepository, 'getSessionTimeRemain').mockResolvedValue(600);
    // biome-ignore lint/suspicious/noExplicitAny: overloaded spy requires any to accept number[]
    (vi.spyOn(iracingRepository, 'getLastLapTime') as any).mockResolvedValue(
      Array(64).fill(90),
    );
  });

  it('checkered flag: estimatedTimeRemaining is 0', async () => {
    vi.spyOn(iracingRepository, 'getSessionFlags').mockResolvedValue(
      0x00000001,
    );
    const result = await computeFuel();
    expect(result?.estimatedTimeRemaining).toBe(0);
  });
});

describe('computeFuel - laps remaining (bug in prod due to floating point error)', () => {
  it('compute laps remaining without floating-point error - case 1', () => {
    const estimatedTimeRemaining = 604855.0473280733;
    const playerMedianLapTime = 109.93440246582031;
    const playerLapDistPct = 0.036704059690237045;
    const lapsRemaining = computeLapsRemaining(
      estimatedTimeRemaining,
      playerMedianLapTime,
      playerLapDistPct,
    );
    expect(lapsRemaining).toBe(5501.96329594);
  });

  it('compute laps remaining without floating point error - case 2', () => {
    const estimatedTimeRemaining = 604854.9782329433;
    const playerMedianLapTime = 109.93440246582031;
    const playerLapDistPct = 0.03733257204294205;
    const lapsRemaining = computeLapsRemaining(
      estimatedTimeRemaining,
      playerMedianLapTime,
      playerLapDistPct,
    );
    expect(lapsRemaining).toBe(5501.96266743);
  });
});
