import { describe, expect, it } from 'vitest';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import { computeCarTelemetry } from '#server/dashboard/car-telemetry.dashboard.ts';

describe('computeCarTelemetry', () => {
  it('assembles car telemetry from SDK values', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-telemetry/default.json');

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
