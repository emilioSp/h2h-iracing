// Verifies fuel dashboard payloads during regression tests.
import { describe, expect, it } from 'vitest';

import { computeFuel } from '#dashboard/fuel.dashboard.ts';
import driverRepository from '#repository/driver.repository.ts';
import { FUEL_SAMPLE_WINDOW } from '#repository/fuel.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import sessionInfoRepository from '#repository/session-info.repository.ts';
import telemetryTick from '#server/tick.ts';
import { computeLapsRemaining } from '#server/utils/compute-laps-remaining.ts';

describe('computeFuel', () => {
  it('given iRacing reports too few completed laps when fuel is computed then the dashboard returns no fuel estimate', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/fuel/one-lap-sample.json');
    telemetryTick.resetInMemoryStorage();
    await driverRepository.refreshDriverInfo();
    await sessionInfoRepository.refreshCurrentSessionInfo();

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

  it('given iRacing reports enough completed laps when fuel is computed then the dashboard returns refill values for each margin', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/fuel/accumulating-lap-samples.json',
    );
    telemetryTick.resetInMemoryStorage();
    await driverRepository.refreshDriverInfo();
    await sessionInfoRepository.refreshCurrentSessionInfo();
    await irsdkRepository.refreshTelemetry();
    let result = await computeFuel();

    for (let sample = 1; sample < FUEL_SAMPLE_WINDOW; sample++) {
      await irsdkRepository.refreshTelemetry();
      result = await computeFuel();
    }

    expect(result).toMatchObject({
      fuelRefillNoMarginLap: 280.8,
      fuelRefillForHalfMarginLap: 281.8,
      fuelRefillFor1MarginLap: 282.8,
    });
  });

  it('given iRacing reports the checkered flag when fuel is computed then the dashboard returns no remaining time', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/fuel/checkered.json');
    telemetryTick.resetInMemoryStorage();
    await driverRepository.refreshDriverInfo();
    await sessionInfoRepository.refreshCurrentSessionInfo();

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
  ])(
    'given projected laps contain floating-point error at player position $playerLapDistPct when remaining laps are computed then the error is removed',
    ({ estimatedTimeRemaining, playerLapDistPct, expected }) => {
      expect(
        computeLapsRemaining({
          estimatedTimeRemaining,
          playerMedianLapTime: 109.93440246582031,
          playerLapDistPct,
        }),
      ).toBe(expected);
    },
  );
});
