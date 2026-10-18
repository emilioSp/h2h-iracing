// Verifies car telemetry dashboard payloads during regression tests.
import { describe, expect, it } from 'vitest';

import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import { computeCarTelemetry } from '#server/dashboard/car-telemetry.dashboard.ts';

describe('computeCarTelemetry', () => {
  it('given iRacing reports car control telemetry when the dashboard is computed then the dashboard returns the current settings', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-telemetry/current-settings.json');

    const car = await computeCarTelemetry();

    expect(car).toEqual({
      abs: 4,
      tc: 2,
      isAbsActive: true,
      brakeBias: 0.543,
      isPitSpeedLimiterActive: false,
    });
  });
});
