import { describe, expect, it } from 'vitest';
import {
  computeFuel,
  computeLapsRemaining,
} from '#dashboard/fuel.dashboard.ts';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { FUEL_SAMPLE_WINDOW } from '#repository/fuel.repository.ts';
import {
  loadTelemetryFixture,
  refreshTelemetry,
} from '#repository/irsdk.repository.ts';
import { refreshCurrentSessionInfo } from '#repository/session-info.repository.ts';
import { resetInMemoryStorage } from '#server/tick.ts';

const loadFuelFixture = async (path: string): Promise<void> => {
  loadTelemetryFixture(path);
  resetInMemoryStorage();
  await refreshDriverInfo();
  await refreshCurrentSessionInfo();
};

describe('computeFuel in a race', () => {
  it('returns a partial result before enough samples accumulate', async () => {
    await loadFuelFixture('fixture/telemetry-mock/fuel/race-base.json');

    const result = await computeFuel();

    expect(result).not.toBeNull();
    expect(result?.fuelRefillNoMarginLap).toBeNull();
    expect(result?.fuelRefillForHalfMarginLap).toBeNull();
    expect(result?.fuelRefillFor1MarginLap).toBeNull();
  });

  it('returns ordered refill values after samples accumulate', async () => {
    await loadFuelFixture('fixture/telemetry-mock/fuel/race-frames.json');
    await refreshTelemetry();
    let result = await computeFuel();

    for (let i = 1; i < FUEL_SAMPLE_WINDOW; i++) {
      if (i === 1) expect(result?.fuelRefillNoMarginLap).toBeNull();
      await refreshTelemetry();
      result = await computeFuel();
    }

    expect(result?.fuelRefillNoMarginLap).toBe(280.8);
    expect(result?.fuelRefillForHalfMarginLap).toBe(281.8);
    expect(result?.fuelRefillFor1MarginLap).toBe(282.8);
  });
});

describe('computeFuel with a checkered flag', () => {
  it('sets estimated time remaining to 0', async () => {
    await loadFuelFixture('fixture/telemetry-mock/fuel/checkered.json');

    const result = await computeFuel();

    expect(result?.estimatedTimeRemaining).toBe(0);
  });
});

describe('computeLapsRemaining', () => {
  it('removes floating-point error', () => {
    expect(
      computeLapsRemaining({
        estimatedTimeRemaining: 604855.0473280733,
        playerMedianLapTime: 109.93440246582031,
        playerLapDistPct: 0.036704059690237045,
      }),
    ).toBe(5501.96329594031);

    expect(
      computeLapsRemaining({
        estimatedTimeRemaining: 604854.9782329433,
        playerMedianLapTime: 109.93440246582031,
        playerLapDistPct: 0.03733257204294205,
      }),
    ).toBe(5501.962667427957);
  });
});
