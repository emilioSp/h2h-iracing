import { describe, expect, it } from 'vitest';
import { computeWeather } from '#dashboard/weather.dashboard.ts';
import {
  loadTelemetryFixture,
  refreshTelemetry,
} from '#repository/irsdk.repository.ts';

describe('computeWeather', () => {
  it('assembles weather from SDK telemetry values', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/weather/base.json');

    const weather = await computeWeather();

    expect(weather).toEqual({
      airTemperatureC: 22.5,
      trackTemperatureC: 35.0,
      relativeHumidityPct: 60.6,
      precipitationPct: 54.5,
      trackWetness: 'Dry',
      windDirectionRad: 0,
      windDirectionDeg: 0,
      windRelativeDirectionRad: Math.PI,
      windRelativeDirectionDeg: 180,
      windVelocityMs: 5.0,
      yawNorthDirectionRad: Math.PI,
      yawNorthDirectionDeg: 180,
      sessionSecondsAfterMidnight: 43200,
    });
  });

  it('maps all track wetness values', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/weather/wetness.json');
    const expected = [
      'Unknown',
      'Dry',
      'Mostly Dry',
      'Very Lightly Wet',
      'Lightly Wet',
      'Moderately Wet',
      'Very Wet',
      'Extremely Wet',
    ];

    for (const label of expected) {
      await refreshTelemetry();
      expect((await computeWeather()).trackWetness).toBe(label);
    }
  });
});
