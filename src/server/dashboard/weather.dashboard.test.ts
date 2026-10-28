// Verifies weather dashboard payloads during regression tests.
import { describe, expect, it } from 'vitest';

import { trackWetness } from '#common/constants/track-wetness.ts';
import { computeWeather } from '#dashboard/weather.dashboard.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';

describe('computeWeather', () => {
  it('given iRacing reports weather telemetry when the dashboard is computed then the dashboard returns converted weather data', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/weather/dry-track-with-wind.json',
    );

    const weather = await computeWeather();

    expect(weather).toEqual({
      airTemperatureC: 22.5,
      trackTemperatureC: 35.0,
      relativeHumidityPct: 60.6,
      precipitationPct: 54.5,
      trackWetness: trackWetness.DRY,
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

  it('given iRacing reports an unknown track wetness value when the dashboard is computed then the dashboard returns Unknown', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/weather/unknown-wetness.json',
    );

    const weather = await computeWeather();

    expect(weather.trackWetness).toBe(trackWetness.UNKNOWN);
  });
});
