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

describe('computeFuel', () => {
  it('When iRacing reports too few completed laps then the dashboard returns no fuel estimate', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/fuel/one-lap-sample.json');
    resetInMemoryStorage();
    await refreshDriverInfo();
    await refreshCurrentSessionInfo();

    const result = await computeFuel();

    expect(result).toEqual({
      fuelRefillNoMarginLap: null,
      fuelRefillForHalfMarginLap: null,
      fuelRefillFor1MarginLap: null,
      estimatedTimeRemaining: null,
      lapsRemaining: null,
      medianFuelPerLap: null,
      fuelLevel: 50,
      fuelLastLap: null,
      lastLapNumber: 0,
      timeRemaining: 600,
    });
  });

  it('When iRacing reports enough completed laps then the dashboard returns refill values for each margin', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/fuel/accumulating-lap-samples.json',
    );
    resetInMemoryStorage();
    await refreshDriverInfo();
    await refreshCurrentSessionInfo();
    await refreshTelemetry();
    let result = await computeFuel();

    for (let sample = 1; sample < FUEL_SAMPLE_WINDOW; sample++) {
      await refreshTelemetry();
      result = await computeFuel();
    }

    expect(result).toMatchObject({
      fuelRefillNoMarginLap: 280.8,
      fuelRefillForHalfMarginLap: 281.8,
      fuelRefillFor1MarginLap: 282.8,
    });
  });

  it('When iRacing reports the checkered flag then the dashboard returns no remaining time', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/fuel/checkered.json');
    resetInMemoryStorage();
    await refreshDriverInfo();
    await refreshCurrentSessionInfo();

    const result = await computeFuel();

    expect(result?.estimatedTimeRemaining).toBe(0);
  });
});

describe('computeLapsRemaining', () => {
  it.each([
    {
      estimatedTimeRemaining: 604855.0473280733,
      playerLapDistPct: 0.036704059690237045,
      expected: 5501.96329594031,
    },
    {
      estimatedTimeRemaining: 604854.9782329433,
      playerLapDistPct: 0.03733257204294205,
      expected: 5501.962667427957,
    },
  ])('When projected laps contain floating-point error at player position $playerLapDistPct then the error is removed', ({
    estimatedTimeRemaining,
    playerLapDistPct,
    expected,
  }) => {
    expect(
      computeLapsRemaining({
        estimatedTimeRemaining,
        playerMedianLapTime: 109.93440246582031,
        playerLapDistPct,
      }),
    ).toBe(expected);
  });
});
