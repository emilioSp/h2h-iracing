import { describe, expect, it } from 'vitest';
import { computeWeather } from '#dashboard/weather.dashboard.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';

describe('computeWeather', () => {
  it('When iRacing reports weather telemetry then the dashboard returns converted weather data', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/weather/dry-track-with-wind.json',
    );

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

  it('When iRacing reports an unknown track wetness value then the dashboard returns Unknown', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/weather/unknown-wetness.json');

    const weather = await computeWeather();

    expect(weather.trackWetness).toBe('Unknown');
  });
});
